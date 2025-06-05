import { z } from 'zod'

// Email validation
export const emailSchema = z.string().email('Please enter a valid email address')

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Phone number validation
export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
  .optional()
  .or(z.literal(''))

// URL validation
export const urlSchema = z.string().url('Please enter a valid URL').optional().or(z.literal(''))

// Required string validation
export const requiredStringSchema = z.string().min(1, 'This field is required')

// Optional string validation
export const optionalStringSchema = z.string().optional().or(z.literal(''))

// Number validation
export const numberSchema = z.number().min(0, 'Must be a positive number')
export const optionalNumberSchema = z.number().min(0).optional()

// User registration schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: requiredStringSchema,
  role: z.enum(['admin', 'agent', 'viewer']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// User login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Contact schema
export const contactSchema = z.object({
  email: emailSchema.optional().or(z.literal('')),
  firstName: optionalStringSchema,
  lastName: optionalStringSchema,
  phone: phoneSchema,
  company: optionalStringSchema,
  jobTitle: optionalStringSchema,
  lifecycleStage: optionalStringSchema,
  leadStatus: optionalStringSchema,
})

// Property schema
export const propertySchema = z.object({
  address: requiredStringSchema,
  city: requiredStringSchema,
  state: requiredStringSchema,
  zipCode: requiredStringSchema,
  county: requiredStringSchema,
  propertyType: requiredStringSchema,
  bedrooms: optionalNumberSchema,
  bathrooms: optionalNumberSchema,
  squareFeet: optionalNumberSchema,
  lotSize: optionalNumberSchema,
  yearBuilt: z.number().min(1800).max(new Date().getFullYear() + 1).optional(),
  estimatedValue: optionalNumberSchema,
  taxAssessedValue: optionalNumberSchema,
  annualTaxes: optionalNumberSchema,
  ownerName: optionalStringSchema,
  ownerPhone: phoneSchema,
  ownerEmail: emailSchema.optional().or(z.literal('')),
  mailingAddress: optionalStringSchema,
})

// CEL rule schema
export const celRuleSchema = z.object({
  name: requiredStringSchema,
  description: optionalStringSchema,
  celExpression: requiredStringSchema,
  isActive: z.boolean(),
  priority: z.number().min(1).max(10),
  alertFrequency: z.enum(['immediate', 'daily', 'weekly']),
})

// Search filters schema
export const propertySearchSchema = z.object({
  search: optionalStringSchema,
  city: optionalStringSchema,
  state: optionalStringSchema,
  county: optionalStringSchema,
  propertyType: optionalStringSchema,
  minValue: optionalNumberSchema,
  maxValue: optionalNumberSchema,
  minBedrooms: optionalNumberSchema,
  maxBedrooms: optionalNumberSchema,
  minBathrooms: optionalNumberSchema,
  maxBathrooms: optionalNumberSchema,
  minSquareFeet: optionalNumberSchema,
  maxSquareFeet: optionalNumberSchema,
  minYearBuilt: z.number().min(1800).optional(),
  maxYearBuilt: z.number().max(new Date().getFullYear() + 1).optional(),
})

export const contactSearchSchema = z.object({
  search: optionalStringSchema,
  lifecycleStage: optionalStringSchema,
  leadStatus: optionalStringSchema,
  company: optionalStringSchema,
  lastActivityAfter: optionalStringSchema,
  lastActivityBefore: optionalStringSchema,
})

// Utility functions
export const validateEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success
}

export const validatePassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success
}

export const validatePhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success
}

export const validateUrl = (url: string): boolean => {
  return urlSchema.safeParse(url).success
}

// Form validation helper
export const getFieldError = (
  errors: Record<string, any>,
  fieldName: string
): string | undefined => {
  const error = errors[fieldName]
  if (!error) return undefined
  
  if (typeof error === 'string') return error
  if (error.message) return error.message
  if (Array.isArray(error) && error.length > 0) return error[0]
  
  return undefined
}

// CSV validation
export const validateCsvHeaders = (
  headers: string[],
  requiredHeaders: string[]
): { isValid: boolean; missingHeaders: string[] } => {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim())
  const normalizedRequired = requiredHeaders.map(h => h.toLowerCase().trim())
  
  const missingHeaders = normalizedRequired.filter(
    header => !normalizedHeaders.includes(header)
  )
  
  return {
    isValid: missingHeaders.length === 0,
    missingHeaders,
  }
}

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

// Validate file size
export const validateFileSize = (file: File, maxSizeMB: number = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Validate file type
export const validateFileType = (
  file: File,
  allowedTypes: string[] = ['text/csv', 'application/vnd.ms-excel']
): boolean => {
  return allowedTypes.includes(file.type)
}