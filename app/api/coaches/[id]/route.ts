import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const coach = await prisma.coach.findUnique({
      where: { id: Number(params.id) },
      include: {
        experience: true,
        certifications: true,
        reviews: true,
        availability: true,
        ageGroups: true,
      },
    })

    if (!coach) {
      return NextResponse.json({ error: 'Coach not found' }, { status: 404 })
    }

    // Split the string fields back into arrays
    const coachWithArrays = {
      ...coach,
      specialties: coach.specialties.split(','),
      availability: coach.availability.map(a => ({ ...a, times: a.times.split(',') })),
      ageGroups: coach.ageGroups.map(ag => ({ ...ag, focus: ag.focus.split(',') })),
    };


    return NextResponse.json(coachWithArrays)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
