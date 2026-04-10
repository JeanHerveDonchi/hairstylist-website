import { supabase } from '@/lib/supabase'
import type { CustomerInput, Customer } from '@/types/customer.types'

/**
 * Find an existing customer by (email + phone) or create one.
 * The function is structured so that the caller can simulate a rollback
 * after creation (useful to keep the same transactional shape when
 * later creating bookings in the same operation).
 *
 * Note: Supabase REST API does not expose multi-statement transactions
 * via the client SDK — for the purposes of the exercise we perform
 * the lookup + insert and, if simulateRollback is requested, delete the
 * inserted record and throw to simulate a rollback.
 */
export async function findOrCreateCustomer(
  data: CustomerInput,
  options?: { simulateRollback?: boolean }
): Promise<Customer> {
  const { firstName, lastName, email, phone } = data
  const simulateRollback = options?.simulateRollback === true

  function extractData(resp: any) {
    if (!resp) return null
    if (resp.data !== undefined) return resp.data
    // sometimes mocks return the row object directly
    if (resp.id !== undefined) return resp
    return null
  }

  // 1) Try to find existing customer by email + phone
  const selectResp = await supabase
    .from('customers')
    .select('*')
    .eq('email', email)
    .eq('phone', phone)
    .single()

  const existing = extractData(selectResp) as Customer | null
  if (existing) {
    return existing
  }

  // 2) Create new customer
  const insertResp = await supabase
    .from('customers')
    .insert([
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      },
    ])
    .select()
    .single()

  const created = extractData(insertResp) as Customer | null

  if (!created) {
    throw new Error('Failed to create customer')
  }

  // 3) Simulate transactional rollback if requested
  if (simulateRollback) {
    // remove inserted record to simulate rollback
    if (created.id) {
      await supabase.from('customers').delete().eq('id', created.id)
    }
    throw new Error('Simulated rollback after customer creation')
  }

  return created
}
