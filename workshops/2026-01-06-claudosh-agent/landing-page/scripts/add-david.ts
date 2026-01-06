import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function main() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from('workshop_registrations')
    .insert({
      name: 'דוד הלל',
      email: 'david@reshimu.com',
      phone: '+972 54-670-9677',
      normalized_phone: '972546709677',
      workshop_name: 'claudosh-agent-2026-01-06',
      payment_status: 'pending',
      marketing_consent: false,
      is_waitlist: false
    })
    .select()
    .single()

  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Success:', data)
  }
}

main()
