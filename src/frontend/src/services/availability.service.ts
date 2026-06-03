import { api } from '@/lib/api'
import type { AvailabilityResult } from '@/types/booking.types'

export async function fetchAvailability(
  date: string,
  hairstylistId?: string | null,
): Promise<AvailabilityResult> {
  return api.availability.get(date, hairstylistId)
}
