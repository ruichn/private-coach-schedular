import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { createSessionSchema, validateRequest } from '@/lib/validation'
import { sanitizeLogData } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeHidden = searchParams.get('includeHidden') === 'true'
    
    // For admin requests, include hidden sessions
    // For public requests, only show visible and future sessions
    const where = includeHidden ? {} : {
      isVisible: true,
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000) // Yesterday or later (delisted at midnight after session day)
      }
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        coach: true,
        registrations: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('GET sessions error:', sanitizeLogData(error))
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication for session creation
  const authError = requireAdminAuth(request)
  if (authError) {
    return authError
  }

  try {
    const body = await request.json()
    
    // Validate input data
    const validation = validateRequest(createSessionSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const {
      coachId,
      sport,
      ageGroup,
      subgroup,
      date,
      time,
      location,
      address,
      maxParticipants,
      price,
      focus,
      isVisible,
    } = validation.data

    const session = await prisma.session.create({
      data: {
        coachId,
        sport: sport || 'volleyball', // Default to volleyball
        ageGroup,
        subgroup,
        date: new Date(date.includes('T') ? date : date + 'T12:00:00.000Z'),
        time,
        location,
        address,
        maxParticipants,
        currentParticipants: 0,
        price,
        focus,
        isVisible: isVisible !== undefined ? isVisible : true, // Default to visible
      },
      include: {
        coach: true,
        registrations: true,
      },
    })

    console.log('Session created successfully:', session.id, 'by admin')
    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('POST session error:', sanitizeLogData(error))
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}