import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY') {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Missing required Vite env variable: ${key}`)
  }

  return value
}

const url = getRequiredEnv('VITE_SUPABASE_URL')
const key = getRequiredEnv('VITE_SUPABASE_ANON_KEY')

// Initialize Supabase client
export const supabase = createClient(url, key);
