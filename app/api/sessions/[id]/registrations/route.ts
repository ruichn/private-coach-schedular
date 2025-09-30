import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendRegistrationConfirmation } from '@/lib/email'
import { sendRegistrationSMS } from '@/lib/sms'
import { registrationSchema, cancellationSchema, validateRequest } from '@/lib/validation'
import { sanitizeLogData } from '@/lib/security'
import crypto from 'crypto'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validation = validateRequest(registrationSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    
    const {
      playerName: rawPlayerName,
      playerAge,
      parentName: rawParentName,
      parentEmail: rawParentEmail,
      parentPhone,
      emergencyContact,
      emergencyPhone,
      medicalInfo,
      experience,
      specialNotes,
    } = validation.data

    // Trim whitespace from all text inputs to prevent issues with autocomplete
    const playerName = rawPlayerName.trim()
    const parentName = rawParentName.trim()
    const parentEmail = rawParentEmail.trim()

    const { id } = await params
    const sessionId = Number(id)
    console.log('Registration request for session:', sessionId, 'Player:', '[REDACTED]')

    // Check if session exists and has capacity
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { registrations: true },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.registrations.length >= session.maxParticipants) {
      return NextResponse.json({ error: 'Session is full' }, { status: 400 })
    }

    // Check for duplicate registration - same email and player name for this session
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        sessionId: sessionId,
        parentEmail: parentEmail.toLowerCase(), // Case-insensitive email check
        playerName: {
          equals: playerName,
          mode: 'insensitive' // Case-insensitive name check
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json({ 
        error: `${playerName} is already registered for this session with email ${parentEmail}. Please check your email for the confirmation details or contact us if you need to make changes.`,
        isDuplicate: true
      }, { status: 409 }) // 409 Conflict status for duplicate
    }

    // Generate cancellation token that expires 24 hours before session
    const cancellationToken = crypto.randomBytes(32).toString('hex')
    
    // Extract start time from time range and convert to 24-hour format
    let startTime = session.time.split(' - ')[0] || session.time.split('-')[0] || session.time
    
    // Convert 12-hour format to 24-hour format for parsing
    if (startTime.includes('PM') || startTime.includes('AM')) {
      const [time, modifier] = startTime.split(' ')
      let [hours, minutes] = time.split(':')
      
      if (modifier === 'AM') {
        if (hours === '12') {
          hours = '00'
        }
      } else if (modifier === 'PM') {
        if (hours !== '12') {
          hours = (parseInt(hours, 10) + 12).toString()
        }
      }
      
      startTime = `${hours.padStart(2, '0')}:${minutes || '00'}`
    }
    
    const sessionDateTime = new Date(`${session.date.toISOString().split('T')[0]}T${startTime}:00`)
    const tokenExpiresAt = new Date(sessionDateTime.getTime() - 24 * 60 * 60 * 1000) // 24 hours before session

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create the registration
      const registration = await tx.registration.create({
        data: {
          sessionId,
          playerName,
          playerAge: typeof playerAge === 'number' ? playerAge : null,
          parentName,
          parentEmail: parentEmail.toLowerCase(), // Store email in lowercase for consistency
          parentPhone,
          emergencyContact: emergencyContact || null,
          emergencyPhone: emergencyPhone || null,
          medicalInfo: medicalInfo || null,
          experience: experience || null,
          specialNotes: specialNotes || null,
          cancellationToken,
          tokenExpiresAt,
        },
      })

      // Update session participant count
      await tx.session.update({
        where: { id: sessionId },
        data: {
          currentParticipants: session.registrations.length + 1,
        },
      })

      return registration
    })

    // Send confirmation email
    try {
      const cancellationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel/${cancellationToken}`
      
      await sendRegistrationConfirmation({
        sessionId,
        playerName,
        parentName,
        parentEmail,
        sessionDate: session.date.toISOString(),
        sessionTime: session.time,
        sessionLocation: session.location,
        sessionAddress: session.address,
        ageGroup: session.ageGroup,
        sport: session.sport || 'volleyball',
        focus: session.focus,
        price: session.price,
        cancellationToken,
        cancellationUrl,
      })
      
      console.log('Registration confirmation email sent successfully')
    } catch (emailError) {
      console.error('Failed to send confirmation email:', sanitizeLogData(emailError))
      // Don't fail the registration if email fails
    }

    // Send confirmation SMS
    try {
      const smsSuccess = await sendRegistrationSMS({
        playerName,
        parentName,
        parentPhone,
        sessionDate: session.date.toISOString(),
        sessionTime: session.time,
        sessionLocation: session.location,
        sessionAddress: session.address,
        ageGroup: session.ageGroup,
        sport: session.sport || 'volleyball',
        focus: session.focus,
        price: session.price,
        cancellationToken,
        cancellationUrl,
      })
      
      if (smsSuccess) {
        console.log('Registration confirmation SMS sent successfully')
      } else {
        console.log('SMS sending failed, but registration still successful')
      }
    } catch (smsError) {
      console.error('Failed to send confirmation SMS:', sanitizeLogData(smsError))
      // Don't fail the registration if SMS fails
    }

    console.log('Registration created successfully:', result.id)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Registration error:', sanitizeLogData(error))
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const playerName = searchParams.get('playerName')
    
    // Validate input data
    const validation = validateRequest(cancellationSchema, { email, playerName })
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { id } = await params
    const sessionId = Number(id)
    
    const trimmedPlayerName = playerName?.trim()
    const trimmedEmail = email?.trim()
    

    // Find the registration with case-insensitive matching and handle whitespace
    const registration = await prisma.registration.findFirst({
      where: {
        sessionId: sessionId,
        parentEmail: trimmedEmail?.toLowerCase(), // Case-insensitive email lookup
        OR: [
          // Try exact match first
          {
            playerName: {
              equals: trimmedPlayerName,
              mode: 'insensitive' // Case-insensitive name matching
            }
          },
          // Also try matching with potential trailing space (for existing data)
          {
            playerName: {
              equals: trimmedPlayerName + ' ',
              mode: 'insensitive'
            }
          }
        ]
      }
    })

    if (!registration) {
      return NextResponse.json({ 
        error: 'Registration not found. Please check your email and player name.' 
      }, { status: 404 })
    }

    // Get current session to update participant count
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { registrations: true }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Delete registration and update participant count in transaction
    await prisma.$transaction(async (tx) => {
      await tx.registration.delete({
        where: { id: registration.id }
      })

      await tx.session.update({
        where: { id: sessionId },
        data: {
          currentParticipants: Math.max(0, session.currentParticipants - 1)
        }
      })
    })

    console.log('Registration cancelled successfully:', registration.id)
    return NextResponse.json({ 
      message: 'Registration cancelled successfully',
      playerName: registration.playerName 
    })
  } catch (error) {
    console.error('Cancellation error:', sanitizeLogData(error))
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}