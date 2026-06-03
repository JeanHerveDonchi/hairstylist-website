/**
 * Business Rules & Constants
 *
 * Core business logic for the booking system
 */

// ============================================================================
// DATE CONSTRAINTS
// ============================================================================

export const DATE_CONSTRAINTS = {
  minDate: new Date(), // Today
  maxDate: new Date(2050, 11, 31) // Dec 31, 2050
} as const

// ============================================================================
// APPOINTMENT PRICING
// ============================================================================

export const APPOINTMENT_PRICING = {
  nbTaxRate: 0.15,
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
