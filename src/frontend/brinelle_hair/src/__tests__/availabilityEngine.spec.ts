import { describe, expect, it } from 'vitest'

import type { BlockedEvent, BusinessHours } from '@/types/booking.types'
import {
  generateDailySlots,
  getUnavailableSlotsFromBlockedEvents,
  getUnavailableSlotsForMonthFromBlocked,
  isSlotUnavailable,
} from '@/utils/slot-calculations'

const MOCK_BUSINESS_HOURS: BusinessHours[] = [
  { dayOfWeek: 0, openTime: '08:00', closeTime: '19:00' },
  { dayOfWeek: 1, openTime: '08:00', closeTime: '20:00' },
  { dayOfWeek: 2, openTime: '08:00', closeTime: '19:00' },
  { dayOfWeek: 3, openTime: '08:00', closeTime: '19:00' },
  { dayOfWeek: 4, openTime: '08:00', closeTime: '19:00' },
  { dayOfWeek: 5, openTime: '08:00', closeTime: '19:00' },
  { dayOfWeek: 6, openTime: '08:00', closeTime: '19:00' },
]

const MOCK_BLOCKED_EVENTS: BlockedEvent[] = [
  {
    id: 'blocked-1',
    date: '2025-12-15',
    startTime: '10:00',
    endTime: '13:00',
    reason: 'Private appointment',
  },
  {
    id: 'blocked-2',
    date: '2025-12-18',
    startTime: '14:00',
    endTime: '15:00',
    reason: 'Lunch break',
  },
  {
    id: 'blocked-3',
    date: '2025-12-20',
    startTime: '14:00',
    endTime: '15:00',
    reason: 'Lunch break',
  },
  {
    id: 'blocked-4',
    date: '2025-12-22',
    startTime: '09:00',
    endTime: '11:00',
    reason: 'Training',
  },
  {
    id: 'blocked-5',
    date: '2025-12-25',
    startTime: '08:00',
    endTime: '19:00',
    reason: 'Holiday',
  },
]

describe('availabilityEngine', () => {
  it('generates hourly slots from business hours for open days', () => {
    const businessHours = MOCK_BUSINESS_HOURS.find(h => h.dayOfWeek === 1) ?? MOCK_BUSINESS_HOURS[0]

    expect(generateDailySlots(businessHours)).toEqual([
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ])
  })

  it('returns no slots for closed days', () => {
    expect(generateDailySlots(undefined)).toEqual([])
  })

  it('expands blocked events into hourly blocked slots', () => {
    const blockedFor15 = MOCK_BLOCKED_EVENTS.filter(e => e.date === '2025-12-15')
    expect(getUnavailableSlotsFromBlockedEvents(blockedFor15)).toEqual(['10:00', '11:00', '12:00'])

    const blockedFor25 = MOCK_BLOCKED_EVENTS.filter(e => e.date === '2025-12-25')
    expect(getUnavailableSlotsFromBlockedEvents(blockedFor25)).toEqual([
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ])
  })

  it('keeps the slot-level compatibility check', () => {
    const blockedSlots = getUnavailableSlotsFromBlockedEvents(MOCK_BLOCKED_EVENTS.filter(e => e.date === '2025-12-15'))
    expect(isSlotUnavailable('2025-12-15', '11:00', blockedSlots)).toBe(true)
    expect(isSlotUnavailable('2025-12-15', '13:00', blockedSlots)).toBe(false)
  })

  it('builds a sparse blocked-slot map for a month', () => {
    const blockedByDate: Record<string, string[]> = {}

    for (const event of MOCK_BLOCKED_EVENTS) {
      if (!blockedByDate[event.date]) {
        blockedByDate[event.date] = getUnavailableSlotsFromBlockedEvents(MOCK_BLOCKED_EVENTS.filter(e => e.date === event.date))
      }
    }

    expect(getUnavailableSlotsForMonthFromBlocked(2025, 12, blockedByDate)).toEqual({
      '2025-12-15': ['10:00', '11:00', '12:00'],
      '2025-12-18': ['14:00'],
      '2025-12-20': ['14:00'],
      '2025-12-22': ['09:00', '10:00'],
      '2025-12-25': [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
      ],
    })
  })
})
