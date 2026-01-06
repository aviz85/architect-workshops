import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://lrhdriqwteyeelvxipet.supabase.co', 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX')

async function update() {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .update({ payment_status: 'bank' })
    .ilike('phone', '%8488393%')
    .eq('workshop_name', 'claudosh-agent-2026-01-06')
    .select()

  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ עודכן ל-bank:', data?.[0]?.name)
  }
}
update()
