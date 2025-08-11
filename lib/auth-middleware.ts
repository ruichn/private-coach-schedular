import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from './security'

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
               request.cookies.get('admin-token')?.value

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const session = verifyAdminToken(token)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Invalid or expired session' },
      { status: 401 }
    )
  }

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