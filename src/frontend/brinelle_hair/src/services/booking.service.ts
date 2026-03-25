import { supabase } from '@/lib/supabase'
import type { BookingInput, Booking } from '@/types/booking.types'
import type { UUID } from '@/types/common.types'
import { isValidUUID } from '@/utils/validateUUID'

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
  const { firstName, lastName, email, phone } = customer

  // Validate hairstyleId is a UUID before calling RPC
  if (!isValidUUID(hairstyleId)) {
    console.error('createBooking: invalid hairstyleId', { hairstyleId })
    throw new Error('Invalid hairstyle ID')
  }

  const params = {
    p_first_name: firstName,
    p_last_name: lastName,
    p_email: email,
    p_phone: phone,
    p_hairstyle_id: hairstyleId as UUID,
    p_start_datetime: startDatetime,
    p_duration_hours: Math.ceil(durationHours),
  }

  console.log('createBooking: calling RPC create_booking_transaction with', params)

  // call RPC without using a generic constrained by the SDK typings; narrow the result locally
  const rpcResp = await supabase.rpc('create_booking_transaction', params) as unknown as { data: CreateBookingRpcResult | null; error: { message?: string } | null }
  const { data, error } = rpcResp

  if (error) {
    console.error('createBooking: rpc error', error)
    throw new Error(error.message || 'Booking RPC failed')
  }

  console.log('createBooking: rpc response', data)

  if (!data) {
    throw new Error('Booking RPC returned no data')
  }

  if ('error' in data) {
    console.error('createBooking: rpc returned error payload', data)
    throw new Error(data.message || 'Booking failed')
  }

  if ('conflict' in data && data.conflict === true) {
    throw Object.assign(new Error('Booking conflict'), { conflict: true })
  }

  // At this point TypeScript should narrow data to CreateBookingRpcSuccess
  const success = data as CreateBookingRpcSuccess

  return {
    id: success.booking_id,
    hairstyle_id: hairstyleId as UUID,
    customer_id: success.customer_id,
    start_datetime: startDatetime,
    duration_hours: Math.ceil(durationHours),
    status: 'confirmed',
  }
}
