import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const GREEN_API_URL = 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = '7103160388'
const GREEN_API_TOKEN = '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'
const WATCH_PAGE_URL = 'https://ima.master-x.co.il/watch-k8m2p'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }

  return '972' + digits
}

function formatPhoneForWhatsApp(phone: string): string {
  const normalized = normalizePhone(phone)
  return `${normalized}@c.us`
}

async function sendZoomLink(phone: string): Promise<{ success: boolean; error?: string }> {
  const chatId = formatPhoneForWhatsApp(phone)

  const message = `מעולה! התשלום התקבל ✅

הנה הקישור לסדנה *קלוד קוד אמאל׳ה*:

🔗 ${WATCH_PAGE_URL}

🕘 היום בשעה 21:00
⏰ כדאי להיכנס כמה דקות לפני

נתראה! 🚀
אביץ - הארכיטקט`

  const url = `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })

  const data = await response.json()

  if (response.ok && data.idMessage) {
    return { success: true }
  }
  return { success: false, error: data.message || 'Failed to send' }
}

async function markPaid(phoneInput: string) {
  const normalizedPhone = normalizePhone(phoneInput)
  console.log(`Processing phone: ${phoneInput} -> ${normalizedPhone}`)

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Find registration
  const { data: registration, error: findError } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('normalized_phone', normalizedPhone)
    .eq('workshop_name', WORKSHOP_NAME)
    .single()

  if (findError || !registration) {
    console.log(`No registration found for ${normalizedPhone}`)
    console.log('Creating new entry...')

    // Insert minimal registration
    const { error: insertError } = await supabase
      .from('workshop_registrations')
      .insert({
        name: 'Manual Entry',
        phone: phoneInput,
        email: 'manual@entry.com',
        workshop_name: WORKSHOP_NAME,
        normalized_phone: normalizedPhone,
        payment_status: 'bit',
        marketing_consent: false,
        is_waitlist: false,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return
    }
    console.log('Created and marked as paid')
  } else {
    console.log(`Found: ${registration.name} (${registration.email})`)
    console.log(`Current status: ${registration.payment_status}`)

    // Check if already paid
    if (registration.payment_status === 'bit') {
      console.log('⚠️ Already marked as paid - skipping WhatsApp')
      return
    }

    // Update to 'bit'
    const { error: updateError } = await supabase
      .from('workshop_registrations')
      .update({ payment_status: 'bit' })
      .eq('id', registration.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return
    }
    console.log('✅ Updated payment_status to "bit"')
  }

  // Send WhatsApp
  console.log('Sending WhatsApp message...')
  const result = await sendZoomLink(normalizedPhone)

  if (result.success) {
    console.log('✅ WhatsApp sent!')
  } else {
    console.error('❌ WhatsApp failed:', result.error)
  }
}

// Get phone from command line
const phone = process.argv[2]
if (!phone) {
  console.log('Usage: npx ts-node mark-paid.ts <phone>')
  process.exit(1)
}

markPaid(phone)
