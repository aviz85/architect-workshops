import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'
const WORKSHOP_NAME = 'claudosh-agent-2026-01-06'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) digits = digits.substring(3)
  else if (digits.startsWith('0')) digits = digits.substring(1)
  return '972' + digits
}

async function markPaidSilent(phone: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalized = normalizePhone(phone)
  const last7 = phone.replace(/\D/g, '').slice(-7)

  const { data: regs } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  const reg = regs?.find(r => {
    const regDigits = (r.phone || '').replace(/\D/g, '')
    return r.normalized_phone === normalized || regDigits.endsWith(last7)
  })

  if (!reg) {
    console.log('❌ לא נמצא: ' + phone)
    return
  }

  if (reg.payment_status === 'bit') {
    console.log('⏭️ כבר משלם: ' + reg.name)
    return
  }

  const { error } = await supabase
    .from('workshop_registrations')
    .update({ payment_status: 'bit' })
    .eq('id', reg.id)

  if (error) {
    console.log('❌ שגיאה: ' + error.message)
  } else {
    console.log('✅ עודכן: ' + reg.name + ' (' + reg.email + ')')
  }
}

markPaidSilent(process.argv[2] || '')
