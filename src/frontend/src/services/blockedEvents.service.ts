import { api } from '@/lib/api'
import type { BlockedEvent } from '@/types/booking.types'

export async function fetchBlockedEventsForDate(date: string): Promise<BlockedEvent[]> {
  const result = await api.availability.get(date)
  return (result.blocked ?? []) as BlockedEvent[]
}
