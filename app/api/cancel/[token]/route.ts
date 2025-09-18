import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCancellationSMS } from '@/lib/sms'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    if (!token) {
      return NextResponse.json({ error: 'Cancellation token is required' }, { status: 400 })
    }

    // Find the registration by token
    const registration = await prisma.registration.findUnique({
      where: {
        cancellationToken: token
      },
      include: {
        session: true
      }
    })

    if (!registration) {
      return NextResponse.json({ 
        error: 'Invalid cancellation link. The registration may have already been cancelled or the link is incorrect.' 
      }, { status: 404 })
    }

    // Check if token has expired (24 hours before session)
    const now = new Date()
    if (registration.tokenExpiresAt && now > registration.tokenExpiresAt) {
      return NextResponse.json({ 
        error: 'This cancellation link has expired. Cancellations must be made at least 24 hours before the training session.' 
      }, { status: 410 })
    }

    // Return registration details for confirmation
    return NextResponse.json({
      registration: {
        id: registration.id,
        playerName: registration.playerName,
        parentName: registration.parentName,
        parentEmail: registration.parentEmail,
        session: {
          id: registration.session.id,
          ageGroup: registration.session.ageGroup,
          subgroup: registration.session.subgroup,
          date: registration.session.date.toISOString().split('T')[0],
          time: registration.session.time,
          location: registration.session.location,
          focus: registration.session.focus
        }
      }
    })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params
    
    if (!token) {
      return NextResponse.json({ error: 'Cancellation token is required' }, { status: 400 })
    }

    // Find the registration by token
    const registration = await prisma.registration.findUnique({
      where: {
        cancellationToken: token
      },
      include: {
        session: true
      }
    })

    if (!registration) {
      return NextResponse.json({ 
        error: 'Invalid cancellation link. The registration may have already been cancelled or the link is incorrect.' 
      }, { status: 404 })
    }

    // Check if token has expired (24 hours before session)
    const now = new Date()
    if (registration.tokenExpiresAt && now > registration.tokenExpiresAt) {
      return NextResponse.json({ 
        error: 'This cancellation link has expired. Cancellations must be made at least 24 hours before the training session.' 
      }, { status: 410 })
    }

    // Cancel the registration in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the registration
      await tx.registration.delete({
        where: { id: registration.id }
      })

      // Update session participant count
      await tx.session.update({
        where: { id: registration.sessionId },
        data: {
          currentParticipants: Math.max(0, registration.session.currentParticipants - 1)
        }
      })
    })

    console.log('Registration cancelled via token:', registration.id, 'Player:', registration.playerName)
    
    // Send cancellation SMS
    try {
      await sendCancellationSMS({
        playerName: registration.playerName,
        parentPhone: registration.parentPhone,
        sessionDate: registration.session.date.toISOString(),
        sessionTime: registration.session.time,
        sport: registration.session.sport || 'volleyball'
      })
      console.log('Cancellation SMS sent successfully')
    } catch (smsError) {
      console.error('Failed to send cancellation SMS:', smsError)
      // Don't fail the cancellation if SMS fails
    }
    
    return NextResponse.json({ 
      message: 'Registration cancelled successfully',
      playerName: registration.playerName,
      sessionDetails: {
        ageGroup: registration.session.ageGroup,
        sport: registration.session.sport || 'volleyball',
        date: registration.session.date.toISOString().split('T')[0],
        time: registration.session.time
      }
    })
  } catch (error) {
    console.error('Token cancellation error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}