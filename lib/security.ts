import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '3600000') // 1 hour default

export interface AdminSession {
  isAdmin: boolean
  iat: number
  exp: number
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export function generateAdminToken(): string {
  const payload = {
    isAdmin: true,
  }
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: SESSION_TIMEOUT / 1000, // JWT expects seconds
  })
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function sanitizeLogData(data: any): any {
  const sensitiveFields = ['password', 'email', 'phone', 'parentEmail', 'parentPhone', 'emergencyPhone']
  
  if (typeof data !== 'object' || data === null) {
    return data
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item))
  }
  
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]'
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

// Rate limiting store (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxAttempts) {
    return false
  }
  
  record.count++
  return true
}

export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}