import { createClient } from '@supabase/supabase-js'

function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing env variable: ${key}`)
  return value
}

export const supabase = createClient(
  getEnv('SUPABASE_URL'),
  getEnv('SUPABASE_SERVICE_KEY'),
)
