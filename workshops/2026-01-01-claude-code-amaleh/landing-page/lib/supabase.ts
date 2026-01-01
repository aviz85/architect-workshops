import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role (for API routes)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, serviceRoleKey)
}

export interface WorkshopRegistration {
  id?: string
  name: string
  email: string
  phone: string
  workshop_name: string
  registration_date?: string
  payment_status?: string
  marketing_consent: boolean
  is_waitlist?: boolean
  normalized_phone?: string
  aff_id?: string
  notes?: string
}
