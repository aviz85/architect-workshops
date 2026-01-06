import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lrhdriqwteyeelvxipet.supabase.co',
  'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'
)

async function check() {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('id, name, phone, normalized_phone, payment_status')
    .eq('workshop_name', 'claude-code-amaleh-2026-01-01')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log('Current registrations:')
  data?.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name} | phone: ${r.phone} | normalized: ${r.normalized_phone} | status: ${r.payment_status}`)
  })
}

check()
