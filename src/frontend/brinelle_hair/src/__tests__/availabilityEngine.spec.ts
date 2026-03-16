import { describe, expect, it } from 'vitest'

import {
  generateDailySlots,
  getBlockedSlotsForDate,
  getUnavailableSlotsForMonth,
  isSlotUnavailable,
} from '@/utils/slot-calculations'

describe('availabilityEngine', () => {
  it('generates hourly slots from business hours for open days', () => {
    expect(generateDailySlots('2025-12-15')).toEqual([
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

  it('returns no slots for closed days', () => {
    expect(generateDailySlots('2025-12-14')).toEqual([])
  })

  it('expands blocked events into hourly blocked slots', () => {
    expect(getBlockedSlotsForDate('2025-12-15')).toEqual(['10:00', '11:00', '12:00'])
    expect(getBlockedSlotsForDate('2025-12-25')).toEqual([
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
    expect(isSlotUnavailable('2025-12-15', '11:00')).toBe(true)
    expect(isSlotUnavailable('2025-12-15', '13:00')).toBe(false)
  })

  it('builds a sparse blocked-slot map for a month', () => {
    expect(getUnavailableSlotsForMonth(2025, 12)).toEqual({
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
