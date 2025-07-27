import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        session: {
          select: {
            id: true,
            ageGroup: true,
            subgroup: true,
            date: true,
            time: true,
            location: true,
            focus: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format the data for the frontend
    const formattedRegistrations = registrations.map(registration => ({
      ...registration,
      session: {
        ...registration.session,
        date: registration.session.date.toISOString().split('T')[0]
      }
    }))

    return NextResponse.json(formattedRegistrations)
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}