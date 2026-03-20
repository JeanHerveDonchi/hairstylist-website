import { supabase } from "@/lib/supabase";

export async function fetchAvailability(date: string, hairstylistId?: string | null) {

  const dayOfWeek = new Date(date).getDay();

  // Get business hours
  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!hours) {
    return { isClosed: true }
  }

  // 2. Get appointments
  // Only filter by hairstylist_id when a valid id is provided to avoid REST 400
  let appointmentsQuery = supabase
    .from('appointments')
    .select('*')
    .eq('date', date)

  if (hairstylistId) {
    appointmentsQuery = appointmentsQuery.eq('hairstylist_id', hairstylistId)
  }

  const { data: appointments } = await appointmentsQuery

  // 3. Get blocked events
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
    blocked: blocked || []
  }
}
