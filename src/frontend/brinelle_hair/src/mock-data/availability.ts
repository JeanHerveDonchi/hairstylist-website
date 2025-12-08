/**
 * Mock Availability Data
 * 
 * Simulates database of unavailable slots
 * In production, this data comes from backend API
 */

import { type UnavailableSlot, UnavailabilityReason } from '@/types/booking.types'

// ============================================================================
// MOCK UNAVAILABLE SLOTS
// ============================================================================

/**
 * Simulates unavailable_slots table
 * Includes both admin blocks and existing bookings
 */
export const MOCK_UNAVAILABLE_SLOTS: UnavailableSlot[] = [
  // ===== ADMIN BLOCKED DATES =====
  
  // Christmas Day - entire day blocked
  { date: '2025-12-25', timeSlot: '08:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '09:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '10:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '11:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '12:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '13:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '14:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '15:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '16:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '17:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '18:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2025-12-25', timeSlot: '19:00', reason: UnavailabilityReason.AdminBlocked },
  
  // New Year's Day - entire day blocked
  { date: '2026-01-01', timeSlot: '08:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '09:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '10:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '11:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '12:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '13:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '14:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '15:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '16:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '17:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '18:00', reason: UnavailabilityReason.AdminBlocked },
  { date: '2026-01-01', timeSlot: '19:00', reason: UnavailabilityReason.AdminBlocked },
  
  // Partial day block - Dec 20, 2pm personal appointment
  { date: '2025-12-20', timeSlot: '14:00', reason: UnavailabilityReason.AdminBlocked },
  
  // ===== EXISTING BOOKINGS =====
  
  // Dec 15 - 10am booking (3-hour service)
  { date: '2025-12-15', timeSlot: '10:00', reason: UnavailabilityReason.Booked, bookingId: 'booking_001' },
  { date: '2025-12-15', timeSlot: '11:00', reason: UnavailabilityReason.Booked, bookingId: 'booking_001' },
  { date: '2025-12-15', timeSlot: '12:00', reason: UnavailabilityReason.Booked, bookingId: 'booking_001' },
  
  // Dec 18 - 2pm booking (1-hour service)
  { date: '2025-12-18', timeSlot: '14:00', reason: UnavailabilityReason.Booked, bookingId: 'booking_002' },
  
  // Dec 22 - 9am booking (2-hour service)
  { date: '2025-12-22', timeSlot: '09:00', reason: UnavailabilityReason.Booked, bookingId: 'booking_003' },
  { date: '2025-12-22', timeSlot: '10:00', reason: UnavailabilityReason.Booked, bookingId: 'booking_003' },
]

