import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
      include: {
        coach: true,
        registrations: true,
      },
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log('PATCH request body:', body)
    console.log('Session ID:', id)
    
    // Get current session to preserve currentParticipants
    const currentSession = await prisma.session.findUnique({
      where: { id: Number(id) },
      include: { registrations: true }
    })

    if (!currentSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    
    // Ensure date is properly formatted for Prisma and preserve currentParticipants
    const updateData = {
      ...body,
      date: new Date(body.date),
      currentParticipants: currentSession.registrations.length // Keep current count
    }
    
    console.log('Update data:', updateData)

    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        coach: true,
        registrations: true,
      },
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionId = Number(id)
    console.log('Deleting session:', sessionId)

    // First delete all registrations for this session
    await prisma.registration.deleteMany({
      where: { sessionId: sessionId },
    })

    // Then delete the session
    await prisma.session.delete({
      where: { id: sessionId },
    })

    console.log('Session deleted successfully')
    return NextResponse.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}