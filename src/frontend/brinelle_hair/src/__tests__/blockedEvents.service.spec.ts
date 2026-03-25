import { describe, it, expect, vi, afterEach } from 'vitest'

vi.mock('@/lib/supabase', () => {
  return { supabase: { from: () => ({}) } }
})

import { supabase } from '@/lib/supabase'
import { fetchBlockedEventsForDate } from '@/services/blockedEvents.service'

describe('fetchBlockedEventsForDate', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('maps supabase rows to BlockedEvent[] correctly', async () => {
    const rawRows = [
      {
        id: 'be_1',
        date: '2026-03-28',
        start_time: '09:00:00',
        end_time: '10:00:00',
        reason: 'Maintenance',
        appointments_id: null,
      },
      {
        id: 'be_2',
        date: '2026-03-28',
        start_time: '12:00:00',
        end_time: '13:30:00',
        reason: 'Private event',
        appointments_id: 'b_123',
      },
    ]

    const fromMock = vi.spyOn(supabase, 'from')

    fromMock.mockImplementationOnce(() => ({
      select() { return this },
      eq() { return Promise.resolve({ data: rawRows, error: null }) },
    }) as any)

    const result = await fetchBlockedEventsForDate('2026-03-28')
    const secondResult = result[1]

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      id: 'be_1',
      date: '2026-03-28',
      startTime: '09:00:00',
      endTime: '10:00:00',
      reason: 'Maintenance',
      bookingId: null,
    })
    expect(secondResult).toBeDefined()
    expect(secondResult?.bookingId).toBe('b_123')
  })

  it('returns empty array on supabase error', async () => {
    const fromMock = vi.spyOn(supabase, 'from')

    fromMock.mockImplementationOnce(() => ({
      select() { return this },
      eq() { return Promise.resolve({ data: null, error: { message: 'DB fail' } }) },
    }) as any)

    const result = await fetchBlockedEventsForDate('2026-03-28')
    expect(result).toEqual([])
  })
})
