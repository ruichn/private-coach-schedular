import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth-middleware'
import { sanitizeLogData } from '@/lib/security'
import { z } from 'zod'
import { validateRequest } from '@/lib/validation'

const createLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(100, 'Location name too long'),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long')
})

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        lastUsed: 'desc'
      }
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('GET locations error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication for location creation
  const authError = requireAdminAuth(request)
  if (authError) {
    return authError
  }

  try {
    const body = await request.json()
    
    // Validate input data
    const validation = validateRequest(createLocationSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, address } = validation.data

    // Check if location already exists (case insensitive)
    const existingLocation = await prisma.location.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    })

    if (existingLocation) {
      // Update lastUsed timestamp if location exists
      const updatedLocation = await prisma.location.update({
        where: { id: existingLocation.id },
        data: { 
          lastUsed: new Date(),
          address: address // Update address in case it changed
        }
      })
      return NextResponse.json(updatedLocation)
    }

    // Create new location
    const location = await prisma.location.create({
      data: {
        name,
        address
      }
    })

    console.log('Location created successfully:', location.id)
    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('POST location error:', sanitizeLogData(error))
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}