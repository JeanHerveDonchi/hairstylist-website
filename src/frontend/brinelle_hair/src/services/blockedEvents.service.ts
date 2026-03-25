import { supabase } from '@/lib/supabase'
import type { BlockedEvent } from '@/types/booking.types'

export async function fetchBlockedEventsForDate(date: string): Promise<BlockedEvent[]> {
  const { data, error } = await supabase
    .from('blocked_events')
    .select('id, date, start_time, end_time, reason, appointments_id')
    .eq('date', date)

  if (error) {
    console.error('fetchBlockedEventsForDate error', error)
    return []
  }

  return (data ?? []).map((r: any) => ({
    id: r.id || `${r.date}-${r.start_time}-${r.end_time}`,
    date: r.date,
    startTime: r.start_time,
    endTime: r.end_time,
    reason: r.reason,
    bookingId: r.appointments_id || null,
  }))
}
