import { supabase } from '../lib/supabase'
import type { BookingInput, Booking } from '../dtos'

interface CreateBookingRpcSuccess {
  conflict: false
  booking_id: string
  customer_id: string
}

interface CreateBookingRpcConflict {
  conflict: true
}

interface CreateBookingRpcError {
  error: true
  message: string
  code?: string
}

type CreateBookingRpcResult = CreateBookingRpcSuccess | CreateBookingRpcConflict | CreateBookingRpcError | null

export async function createBooking(input: BookingInput): Promise<Booking> {
  const { hairstyleId, customer, startDatetime, durationHours } = input

  const params = {
    p_first_name: customer.firstName,
    p_last_name: customer.lastName,
    p_email: customer.email,
    p_phone: customer.phone,
    p_hairstyle_id: hairstyleId,
    p_start_datetime: startDatetime,
    p_duration_hours: Math.ceil(durationHours),
  }

  const rpcResp = await supabase.rpc('create_booking_transaction', params) as unknown as {
    data: CreateBookingRpcResult | null
    error: { message?: string } | null
  }

  const { data, error } = rpcResp

  if (error) {
    throw new Error(error.message || 'Booking RPC failed')
  }

  if (!data) {
    throw new Error('Booking RPC returned no data')
  }

  if ('error' in data) {
    throw new Error(data.message || 'Booking failed')
  }

  if ('conflict' in data && data.conflict === true) {
    throw Object.assign(new Error('Booking conflict'), { conflict: true })
  }

  const success = data as CreateBookingRpcSuccess

  return {
    id: success.booking_id,
    hairstyle_id: hairstyleId,
    customer_id: success.customer_id,
    start_datetime: startDatetime,
    duration_hours: Math.ceil(durationHours),
    status: 'confirmed',
  }
}
