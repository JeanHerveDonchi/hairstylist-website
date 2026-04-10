import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock supabase client module to expose only rpc
vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}))

import { supabase } from '@/lib/supabase'
import { createBooking } from '@/services/booking.service'

describe('createBooking (RPC-first)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates booking successfully when no conflict', async () => {
    const now = new Date().toISOString()
    const rpcResponse = { data: { conflict: false, booking_id: 'b1', customer_id: 'cust_1' }, error: null }

    ;(supabase as any).rpc.mockResolvedValue(rpcResponse)

    const validUUID = '123e4567-e89b-12d3-a456-426614174000'

    const input = {
      hairstyleId: validUUID,
      customer: { firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '111' },
      startDatetime: now,
      durationHours: 1,
    }

    const result = await createBooking(input as any)

    expect(result).toEqual({
      id: 'b1',
      hairstyle_id: validUUID,
      customer_id: 'cust_1',
      start_datetime: now,
      duration_hours: 1,
      status: 'confirmed',
    })

    expect((supabase as any).rpc).toHaveBeenCalledWith(
      'create_booking_transaction',
      expect.objectContaining({ p_hairstyle_id: validUUID })
    )
  })

  it('throws Booking conflict when RPC indicates conflict', async () => {
    ;(supabase as any).rpc.mockResolvedValue({ data: { conflict: true }, error: null })

    const input = {
      hairstyleId: '123e4567-e89b-12d3-a456-426614174000',
      customer: { firstName: 'C', lastName: 'D', email: 'c@d.com', phone: '222' },
      startDatetime: new Date().toISOString(),
      durationHours: 2,
    }

    await expect(createBooking(input as any)).rejects.toThrow('Booking conflict')
  })

  it('throws when RPC errors', async () => {
    ;(supabase as any).rpc.mockRejectedValue(new Error('DB down'))

    const input = {
      hairstyleId: '123e4567-e89b-12d3-a456-426614174000',
      customer: { firstName: 'E', lastName: 'F', email: 'e@f.com', phone: '333' },
      startDatetime: new Date().toISOString(),
      durationHours: 1,
    }

    await expect(createBooking(input as any)).rejects.toThrow('DB down')
  })

  it('edge overlap conflict (RPC reports conflict)', async () => {
    ;(supabase as any).rpc.mockResolvedValue({ data: { conflict: true }, error: null })

    const input = {
      hairstyleId: '123e4567-e89b-12d3-a456-426614174000',
      customer: { firstName: 'G', lastName: 'H', email: 'g@h.com', phone: '444' },
      startDatetime: new Date().toISOString(),
      durationHours: 0.5,
    }

    await expect(createBooking(input as any)).rejects.toThrow('Booking conflict')
  })
})
