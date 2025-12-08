/**
 * Business Rules & Constants
 * 
 * Core business logic for the booking system
 */



// ============================================================================
// BUSINESS HOURS
// ============================================================================

export const BUSINESS_HOURS = {
  startHour: 8,      // 8:00 AM
  endHour: 20,       // 8:00 PM (last slot at 7pm for 1-hour minimum)
  slotInterval: 60   // 1 hour in minutes
} as const

// ============================================================================
// DATE CONSTRAINTS
// ============================================================================

export const DATE_CONSTRAINTS = {
  minDate: new Date(), // Today
  maxDate: new Date(2050, 11, 31) // Dec 31, 2050
} as const

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

export const VALIDATION_PATTERNS = {
  // Canadian phone: +1 (XXX) XXX-XXXX or variations
  canadianPhone: /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/,
  
  // Email: standard RFC 5322
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Name: letters, spaces, hyphens, apostrophes only
  name: /^[a-zA-ZÀ-ÿ\s'-]+$/
} as const

