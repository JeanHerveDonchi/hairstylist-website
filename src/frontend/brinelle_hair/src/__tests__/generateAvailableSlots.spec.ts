import { describe, expect, it } from 'vitest'

import { generateTimeSlots } from '@/utils/slot-calculations/generateAvailableSlots'

describe('generateTimeSlots', () => {
  it('returns all business-hour slots and flags booked ones as unavailable', () => {
    const slots = generateTimeSlots({
      hours: {
        open_time: '08:00',
        close_time: '13:00',
      },
      appointments: [
        {
          start_time: '10:00',
          duration_hours: 1,
        },
      ],
      blocked: [],
      duration: 1,
    })

    expect(slots).toEqual([
      { time: '08:00', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
    ])
  })

  it('flags slots that would run past closing time as unavailable', () => {
    const slots = generateTimeSlots({
      hours: {
        open_time: '08:00',
        close_time: '12:00',
      },
      appointments: [],
      blocked: [],
      duration: 2,
    })

    expect(slots).toEqual([
      { time: '08:00', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
    ])
  })
})
