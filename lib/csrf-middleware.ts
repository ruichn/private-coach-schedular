import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function setCSRFCookie(response: NextResponse, token?: string): NextResponse {
  const csrfToken = token || generateCSRFToken()
  
  response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
    httpOnly: false, // Must be readable by JavaScript for forms
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  })
  
  return response
}

export function validateCSRFToken(request: NextRequest): boolean {
  const method = request.method.toUpperCase()
  
  // Only validate CSRF for state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true
  }
  
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  
  if (!cookieToken || !headerToken) {
    return false
  }
  
  return cookieToken === headerToken
}

export function requireCSRFToken(request: NextRequest): NextResponse | null {
  if (!validateCSRFToken(request)) {
    return NextResponse.json(
      { error: 'CSRF token validation failed' },
      { status: 403 }
    )
  }
  
  return null
}

export function withCSRFProtection(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const csrfError = requireCSRFToken(request)
    if (csrfError) {
      return csrfError
    }
    
    const response = await handler(request)
    
    // Refresh CSRF token on successful state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method.toUpperCase())) {
      return setCSRFCookie(response)
    }
    
    return response
  }
}