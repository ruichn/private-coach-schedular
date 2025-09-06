import { z } from 'zod'

// Admin login validation
export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required')
})

// Session creation validation
export const createSessionSchema = z.object({
  coachId: z.number().int().positive('Coach ID must be a positive integer'),
  sport: z.string().min(1, 'Sport is required').max(20, 'Sport name too long'),
  ageGroup: z.string().min(1, 'Age group is required').max(50, 'Age group too long'),
  subgroup: z.string().min(1, 'Subgroup is required').max(50, 'Subgroup too long'),
  date: z.string().min(1, 'Date is required').refine((val) => {
    // Accept both YYYY-MM-DD and ISO datetime formats
    return /^\d{4}-\d{2}-\d{2}$/.test(val) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)
  }, 'Invalid date format'),
  time: z.string().min(1, 'Time is required').max(20, 'Time format too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
  maxParticipants: z.number().int().min(1, 'Must allow at least 1 participant').max(50, 'Too many participants'),
  price: z.number().min(0, 'Price cannot be negative').max(1000, 'Price too high').optional(),
  focus: z.string().max(100, 'Focus description too long').optional()
})

// Registration validation
export const registrationSchema = z.object({
  playerName: z.string()
    .min(1, 'Player name is required')
    .max(50, 'Player name too long')
    .regex(/^[a-zA-Z\s-']+$/, 'Player name contains invalid characters'),
  playerAge: z.number().int().min(5, 'Player must be at least 5 years old').max(25, 'Player age too high').optional(),
  parentName: z.string()
    .min(1, 'Parent name is required')
    .max(50, 'Parent name too long')
    .regex(/^[a-zA-Z\s-']+$/, 'Parent name contains invalid characters'),
  parentEmail: z.string()
    .email('Invalid email format')
    .max(100, 'Email too long'),
  parentPhone: z.string()
    .min(10, 'Phone number too short')
    .max(20, 'Phone number too long')
    .regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format'),
  emergencyContact: z.string()
    .max(50, 'Emergency contact name too long')
    .regex(/^[a-zA-Z\s-']*$/, 'Emergency contact contains invalid characters')
    .optional(),
  emergencyPhone: z.string()
    .max(20, 'Emergency phone too long')
    .regex(/^[\d\s\-\(\)\+]*$/, 'Invalid emergency phone format')
    .optional(),
  medicalInfo: z.string()
    .max(500, 'Medical info too long')
    .optional(),
  experience: z.string()
    .max(200, 'Experience description too long')
    .optional(),
  specialNotes: z.string()
    .max(300, 'Special notes too long')
    .optional()
})

// Cancellation validation
export const cancellationSchema = z.object({
  email: z.string().email('Invalid email format'),
  playerName: z.string()
    .min(1, 'Player name is required')
    .max(50, 'Player name too long')
})

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validData = schema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { success: false, error: firstError.message }
    }
    return { success: false, error: 'Validation failed' }
  }
}