import { describe, expect, it, vi, afterEach } from 'vitest'

vi.mock('@/lib/supabase', () => {
  return { supabase: { from: () => ({}) } }
})

import { supabase } from '@/lib/supabase'
import { findOrCreateCustomer } from '@/services/customer.service'

describe('findOrCreateCustomer', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a new customer when none exists', async () => {
    const created = {
      id: 'cust_1',
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@example.com',
      phone: '123-456-7890',
      created_at: new Date().toISOString(),
    }

    const fromMock = vi.spyOn(supabase, 'from')

    fromMock.mockImplementationOnce(() => ({
      select() { return this },
      eq() { return this },
      single: async () => ({ data: null, error: null }),
    }) as any)

    fromMock.mockImplementationOnce(() => ({
      insert() { return this },
      select() { return this },
      single: async () => ({ data: created, error: null }),
    }) as any)

    const result = await findOrCreateCustomer({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      phone: '123-456-7890',
    })

    expect(result).toEqual(created)
  })

  it('returns existing customer and does not insert duplicate', async () => {
    const existing = {
      id: 'cust_2',
      first_name: 'Bob',
      last_name: 'Jones',
      email: 'bob@example.com',
      phone: '555-444-3333',
      created_at: new Date().toISOString(),
    }

    const fromMock = vi.spyOn(supabase, 'from')

    // select returns existing and insert should not be called
    fromMock.mockImplementationOnce(() => ({
      select() { return this },
      eq() { return this },
      single: async () => ({ data: existing, error: null }),
    }) as any)

    // If insert is accidentally called, make it fail the test
    const insertSpy = vi.fn()
    fromMock.mockImplementationOnce(() => ({
      insert: () => { insertSpy(); return { select() { return this }, single: async () => ({ data: null, error: null }) } as any }
    }) as any)

    const result = await findOrCreateCustomer({
      firstName: 'Bob',
      lastName: 'Jones',
      email: 'bob@example.com',
      phone: '555-444-3333',
    })

    expect(result).toEqual(existing)
    expect(insertSpy).not.toHaveBeenCalled()
  })

  it('simulates rollback: created then deleted and throws', async () => {
    const created = {
      id: 'cust_3',
      first_name: 'Carol',
      last_name: 'King',
      email: 'carol@example.com',
      phone: '777-888-9999',
      created_at: new Date().toISOString(),
    }

    const fromMock = vi.spyOn(supabase, 'from')

    // 1) select -> none
    fromMock.mockImplementationOnce(() => ({
      select() { return this },
      eq() { return this },
      single: async () => ({ data: null, error: null }),
    }) as any)

    // 2) insert -> created
    fromMock.mockImplementationOnce(() => ({
      insert() { return this },
      select() { return this },
      single: async () => ({ data: created, error: null }),
    }) as any)

    // 3) delete -> success
    fromMock.mockImplementationOnce(() => ({
      delete() { return { eq: async () => ({ data: [], error: null }) } }
    }) as any)

    await expect(
      findOrCreateCustomer(
        {
          firstName: 'Carol',
          lastName: 'King',
          email: 'carol@example.com',
          phone: '777-888-9999',
        },
        { simulateRollback: true },
      ),
    ).rejects.toThrow('Simulated rollback')
  })
})
