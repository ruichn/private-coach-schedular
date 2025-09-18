import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeLogData } from '@/lib/security'

export async function GET(request: NextRequest) {
  // Require admin authentication for viewing all registrations
  const authError = requireAdminAuth(request)
  if (authError) {
    return authError
  }
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        session: {
          select: {
            id: true,
            sport: true,
            ageGroup: true,
            date: true,
            time: true,
            location: true,
            address: true,
            focus: true,
            price: true,
            maxParticipants: true,
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
    console.error('Error fetching registrations:', sanitizeLogData(error))
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}