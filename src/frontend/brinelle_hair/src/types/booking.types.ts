/**
 * Booking System Type Definitions
 * 
 * Complete type system for the booking flow
 */

// ============================================================================
// BOOKING STEPS
// ============================================================================

export enum BookingStep {
  UserInfo = 1,
  DateTime = 2,
  Confirmation = 3
}

export interface BookingStepConfig {
  step: BookingStep
  title: string
  isComplete: boolean
}

// ============================================================================
// USER INFORMATION
// ============================================================================

export interface UserInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

// ============================================================================
// DATE & TIME
// ============================================================================

export interface TimeSlot {
  time: string       // 'HH:00' format (e.g., '10:00')
  available: boolean
}

export interface DateTimeSelection {
  date: string       // 'YYYY-MM-DD' format
  startTime: string  // 'HH:00' format
}

// ============================================================================
// AVAILABILITY
// ============================================================================

export interface BusinessHours {
  dayOfWeek: number                 // 0 = Sunday, 6 = Saturday
  openTime: string                  // 'HH:00'
  closeTime: string                 // 'HH:00'
}

export enum BlockedReason {
  Booking = 'booking',
  AdminBlocked = 'admin_blocked',
  Holiday = 'holiday',
  Personal = 'personal'
}

export interface BlockedEvent {
  id: string
  date: string                      // 'YYYY-MM-DD'
  startTime: string                 // 'HH:00'
  endTime: string                   // 'HH:00'
  reason: BlockedReason
  bookingId?: string
}

export type UnavailableSlotsByDate = Record<string, string[]>

// ============================================================================
// BOOKING DATA
// ============================================================================

export interface BookingData {
  hairstyleId: string
  hairstyleName: string
  hairstyleDuration: number         // Minutes
  hairstylePrice: number
  userInfo: UserInfo | null
  selectedDate: string | null       // 'YYYY-MM-DD'
  selectedTime: string | null       // 'HH:00'
}

export interface CompletedBooking extends BookingData {
  id: string
  userInfo: UserInfo                // Required (not null)
  selectedDate: string              // Required (not null)
  selectedTime: string              // Required (not null)
  createdAt: Date
  status: 'confirmed' | 'cancelled'
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>    // field -> error message
}

export interface StepValidation {
  step: BookingStep
  validate: () => ValidationResult
}
