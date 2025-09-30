import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from './security'

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const authHeader = request.headers.get('authorization')
  const cookieToken = request.cookies.get('admin-token')?.value
  const token = authHeader?.replace('Bearer ', '') || cookieToken

  console.log('Auth check - Auth header:', authHeader ? 'Present' : 'Missing')
  console.log('Auth check - Cookie token:', cookieToken ? 'Present' : 'Missing')

  if (!token) {
    console.log('Auth check - No token found')
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const session = verifyAdminToken(token)
  
  if (!session) {
    console.log('Auth check - Token verification failed')
    return NextResponse.json(
      { error: 'Invalid or expired session' },
      { status: 401 }
    )
  }

  console.log('Auth check - Token valid')
  // Token is valid, allow request to continue
  return null
}

export function withAdminAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authError = requireAdminAuth(request)
    if (authError) {
      return authError
    }
    
    return handler(request)
  }
}