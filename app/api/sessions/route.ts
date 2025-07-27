import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
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
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('POST session request body:', body)
    
    const {
      coachId,
      ageGroup,
      subgroup,
      date,
      time,
      location,
      address,
      maxParticipants,
      price,
      focus,
    } = body

    const session = await prisma.session.create({
      data: {
        coachId,
        ageGroup,
        subgroup,
        date: new Date(date),
        time,
        location,
        address,
        maxParticipants,
        currentParticipants: 0, // Initialize to 0
        price,
        focus,
      },
      include: {
        coach: true,
        registrations: true,
      },
    })

    console.log('Created session:', session.id)
    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('POST session error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}