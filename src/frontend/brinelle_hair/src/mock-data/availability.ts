/**
 * Mock Availability Data
 *
 * Simulates database-backed availability configuration
 * In production, this data comes from backend API
 */

import { BlockedReason, type BlockedEvent, type BusinessHours } from '@/types/booking.types'

// ============================================================================
// MOCK BUSINESS HOURS
// ============================================================================

/**
 * Salon is open Sunday(0)-Saturday(6), 8:00 AM to 7:00 PM
 */
export const MOCK_BUSINESS_HOURS: BusinessHours[] = [
  { dayOfWeek: 0, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 2, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 3, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 4, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 5, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 6, openTime: '08:00', closeTime: '20:00' },
]

// ============================================================================
// MOCK BLOCKED EVENTS
// ============================================================================

/**
 * Blocked ranges are expanded into hourly slots by the availability engine.
 */
export const MOCK_BLOCKED_EVENTS: BlockedEvent[] = [
  {
    id: 'holiday_1',
    date: '2025-12-25',
    startTime: '08:00',
    endTime: '19:00',
    reason: BlockedReason.Holiday
  },
  {
    id: 'holiday_2',
    date: '2026-01-01',
    startTime: '08:00',
    endTime: '19:00',
    reason: BlockedReason.Holiday
  },
  {
    id: 'personal_1',
    date: '2025-12-20',
    startTime: '14:00',
    endTime: '15:00',
    reason: BlockedReason.Personal
  },
  {
    id: 'booking_001',
    date: '2025-12-15',
    startTime: '10:00',
    endTime: '13:00',
    reason: BlockedReason.Booking,
    bookingId: 'booking_001'
  },
  {
    id: 'booking_002',
    date: '2025-12-18',
    startTime: '14:00',
    endTime: '15:00',
    reason: BlockedReason.Booking,
    bookingId: 'booking_002'
  },
  {
    id: 'booking_003',
    date: '2025-12-22',
    startTime: '09:00',
    endTime: '11:00',
    reason: BlockedReason.Booking,
    bookingId: 'booking_003'
  }
]
