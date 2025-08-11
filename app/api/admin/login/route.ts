import { NextResponse } from 'next/server'
import { verifyPassword, generateAdminToken, checkRateLimit, sanitizeLogData } from '@/lib/security'
import { adminLoginSchema, validateRequest } from '@/lib/validation'

export async function POST(request: Request) {
  const clientIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'

  try {
    // Rate limiting check
    if (!checkRateLimit(`admin-login-${clientIp}`, 5, 15 * 60 * 1000)) {
      console.warn(`Rate limit exceeded for admin login from IP: ${clientIp}`)
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validation = validateRequest(adminLoginSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { password } = validation.data
    const adminPasswordHashBase64 = process.env.ADMIN_PASSWORD_HASH_BASE64
    const adminPasswordHash = adminPasswordHashBase64 ? Buffer.from(adminPasswordHashBase64, 'base64').toString('utf8') : null
    
    if (!adminPasswordHash) {
      console.error('ADMIN_PASSWORD_HASH not configured in environment variables')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Verify password using bcrypt
    const isValidPassword = await verifyPassword(password, adminPasswordHash)
    
    if (isValidPassword) {
      // Generate JWT token
      const token = generateAdminToken()
      
      console.log('Admin login successful from IP:', clientIp)
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Authentication successful',
        token 
      })
      
      // Set HTTP-only cookie for additional security
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
      })
      
      return response
    } else {
      console.warn('Failed admin login attempt from IP:', clientIp)
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
  } catch (error) {
    console.error('Admin login error:', sanitizeLogData(error))
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}