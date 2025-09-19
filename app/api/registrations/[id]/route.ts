import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeLogData } from '@/lib/security'
import { registrationSchema, validateRequest } from '@/lib/validation'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication for updating registrations
  const authError = requireAdminAuth(request)
  if (authError) {
    return authError
  }

  try {
    const { id } = await params
    const registrationId = Number(id)
    
    if (isNaN(registrationId)) {
      return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 })
    }

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

    // Trim whitespace from all text inputs
    const playerName = rawPlayerName.trim()
    const parentName = rawParentName.trim()
    const parentEmail = rawParentEmail.trim()

    // Check if registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: { id: registrationId }
    })

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Update the registration
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        playerName,
        playerAge: typeof playerAge === 'number' ? playerAge : null,
        parentName,
        parentEmail: parentEmail.toLowerCase(),
        parentPhone,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        medicalInfo: medicalInfo || null,
        experience: experience || null,
        specialNotes: specialNotes || null,
      },
    })

    console.log('Registration updated successfully:', registrationId)
    return NextResponse.json(updatedRegistration)
  } catch (error) {
    console.error('Error updating registration:', sanitizeLogData(error))
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication for deleting registrations
  const authError = requireAdminAuth(request)
  if (authError) {
    return authError
  }

  try {
    const { id } = await params
    const registrationId = Number(id)
    
    if (isNaN(registrationId)) {
      return NextResponse.json({ error: 'Invalid registration ID' }, { status: 400 })
    }

    // Check if registration exists and get session info
    const existingRegistration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { session: true }
    })

    if (!existingRegistration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Delete registration and update session participant count in transaction
    await prisma.$transaction(async (tx) => {
      await tx.registration.delete({
        where: { id: registrationId }
      })

      // Update session participant count
      await tx.session.update({
        where: { id: existingRegistration.sessionId },
        data: {
          currentParticipants: Math.max(0, existingRegistration.session.currentParticipants - 1)
        }
      })
    })

    console.log('Registration deleted successfully:', registrationId)
    return NextResponse.json({ message: 'Registration deleted successfully' })
  } catch (error) {
    console.error('Error deleting registration:', sanitizeLogData(error))
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}