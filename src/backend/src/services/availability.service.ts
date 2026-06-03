import { supabase } from '../lib/supabase'
import type { AvailabilityResult } from '../dtos'

export async function fetchAvailability(
  date: string,
  hairstylistId?: string | null,
): Promise<AvailabilityResult> {
  const dayOfWeek = new Date(date).getDay()

  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!hours) {
    return { isClosed: true }
  }

  let appointmentsQuery = supabase
    .from('appointments')
    .select('*')
    .eq('date', date)

  if (hairstylistId) {
    appointmentsQuery = appointmentsQuery.eq('hairstylist_id', hairstylistId)
  }

  const { data: appointments } = await appointmentsQuery

  let blockedQuery = supabase
    .from('blocked_events')
    .select('*')
    .eq('date', date)

  if (hairstylistId) {
    blockedQuery = blockedQuery.eq('hairstylist_id', hairstylistId)
  }

  const { data: blocked } = await blockedQuery

  return {
    isClosed: false,
    hours,
    appointments: appointments || [],
    blocked: blocked || [],
  }
}
