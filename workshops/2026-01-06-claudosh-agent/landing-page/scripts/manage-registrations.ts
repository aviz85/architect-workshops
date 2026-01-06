import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load Morning API env
dotenv.config({ path: path.join(__dirname, '../../../../.claude/skills/morning-invoice/scripts/.env') })

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const WORKSHOP_NAME = 'claudosh-agent-2026-01-06'
const WORKSHOP_TITLE = 'סדנת קלודוש הסוכן המטורף'
const WORKSHOP_DESCRIPTION = 'סדנת קלודוש הסוכן המטורף - 6.1.26'
const AMOUNT = 50
const WATCH_PAGE_URL = 'https://claudosh.master-x.co.il/watch-q3x7z'
const BIT_PAYMENT_LINK = 'https://www.bitpay.co.il/app/share-info?i=181782226981_19nKpAMq'

// Green API config
const GREEN_API_URL = process.env.GREEN_API_URL || 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = process.env.GREEN_API_INSTANCE || '7103160388'
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN || '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

// Morning API config
const MORNING_API_KEY = process.env.MORNING_API_KEY || ''
const MORNING_API_SECRET = process.env.MORNING_API_SECRET || ''
const MORNING_BASE_URL = process.env.MORNING_BASE_URL || 'https://api.greeninvoice.co.il/api/v1'

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
  return normalizePhone(phone) + '@c.us'
}

async function sendWhatsAppMessage(chatId: string, message: string): Promise<boolean> {
  try {
    const url = `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message }),
    })

    const data = await response.json()
    return response.ok && data.idMessage
  } catch (error) {
    console.error('WhatsApp Error:', error)
    return false
  }
}

// הודעת רישום (לפני תשלום)
function getRegistrationMessage(): string {
  return `שלום! 👋

תודה רבה על ההרשמה לסדנה *קלודוש הסוכן המטורף*! 🎉

לאחר ביצוע התשלום תקבל/י הודעה עם קישור לסדנה.

💳 לתשלום (50 ש״ח):
${BIT_PAYMENT_LINK}

🕘 הסדנה ביום שלישי 6.1.26 בשעה 21:00

נתראה! 🚀
אביץ - הארכיטקט`
}

// הודעת אישור תשלום (אחרי תשלום)
function getZoomLinkMessage(): string {
  return `מעולה! התשלום התקבל ✅

הנה הקישור לסדנה *קלודוש הסוכן המטורף*:

🔗 ${WATCH_PAGE_URL}

🕘 יום שלישי 6.1.26 בשעה 21:00
⏰ כדאי להיכנס כמה דקות לפני

נתראה! 🚀
אביץ - הארכיטקט`
}

async function addRegistration(
  name: string,
  email: string,
  phone: string,
  isPaid: boolean = false,
  sendMessage: boolean = true
) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedPhone = normalizePhone(phone)

  // Check if already exists
  const { data: existing } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('normalized_phone', normalizedPhone)
    .eq('workshop_name', WORKSHOP_NAME)
    .single()

  if (existing) {
    console.log(`⚠️ ${name} כבר קיים במערכת (status: ${existing.payment_status})`)

    // Update payment status if needed
    if (isPaid && existing.payment_status !== 'bit') {
      const { error: updateError } = await supabase
        .from('workshop_registrations')
        .update({ payment_status: 'bit' })
        .eq('id', existing.id)

      if (updateError) {
        console.error('Error updating:', updateError)
      } else {
        console.log(`✅ עודכן סטטוס תשלום ל-bit`)
      }
    }
  } else {
    // Insert new registration
    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert({
        name,
        email,
        phone,
        normalized_phone: normalizedPhone,
        workshop_name: WORKSHOP_NAME,
        payment_status: isPaid ? 'bit' : 'pending',
        marketing_consent: false,
        is_waitlist: false,
        notes: 'Manual entry via script',
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting:', error)
      return false
    }

    console.log(`✅ נוסף: ${name} (${email})`)
  }

  // Send WhatsApp message
  if (sendMessage) {
    const chatId = formatPhoneForWhatsApp(phone)
    const message = isPaid ? getZoomLinkMessage() : getRegistrationMessage()

    console.log(`📱 שולח הודעה ל-${phone}...`)
    const sent = await sendWhatsAppMessage(chatId, message)

    if (sent) {
      console.log(`✅ הודעה נשלחה בהצלחה`)
    } else {
      console.log(`❌ שגיאה בשליחת הודעה`)
    }
  }

  return true
}

async function sendZoomToAllPaid() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: paidRegistrations, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)
    .eq('payment_status', 'bit')

  if (error) {
    console.error('Error fetching:', error)
    return
  }

  console.log(`נמצאו ${paidRegistrations?.length || 0} משלמים\n`)

  for (const reg of paidRegistrations || []) {
    const chatId = formatPhoneForWhatsApp(reg.phone || reg.normalized_phone)
    console.log(`📱 שולח ל-${reg.name} (${reg.phone})...`)

    const sent = await sendWhatsAppMessage(chatId, getZoomLinkMessage())

    if (sent) {
      console.log(`   ✅ נשלח`)
    } else {
      console.log(`   ❌ שגיאה`)
    }

    // Small delay between messages
    await new Promise(r => setTimeout(r, 1000))
  }
}

async function listRegistrations() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`=== רשומים לסדנת ${WORKSHOP_NAME} ===\n`)

  const paid = data?.filter(r => r.payment_status === 'bit') || []
  const pending = data?.filter(r => r.payment_status === 'pending') || []

  console.log(`💰 שילמו (${paid.length}):`)
  for (const r of paid) {
    console.log(`  ✅ ${r.name} - ${r.phone} - ${r.email}`)
  }

  console.log(`\n⏳ ממתינים לתשלום (${pending.length}):`)
  for (const r of pending) {
    console.log(`  ⏳ ${r.name} - ${r.phone} - ${r.email}`)
  }

  console.log(`\n📊 סה"כ: ${data?.length || 0}`)
}

async function markAsPaid(phone: string, sendMessage: boolean = true) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedPhone = normalizePhone(phone)
  const digits = phone.replace(/\D/g, '')

  // Try to find by normalized_phone OR by phone field containing the digits
  const { data: registrations, error: fetchError } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  if (fetchError) {
    console.error('Error fetching:', fetchError)
    return false
  }

  // Find matching registration
  const existing = registrations?.find(r => {
    const regDigits = (r.phone || '').replace(/\D/g, '')
    const regNormalized = r.normalized_phone || ''
    return regNormalized === normalizedPhone ||
           regDigits === digits ||
           regDigits.endsWith(digits.slice(-9)) ||
           digits.endsWith(regDigits.slice(-9))
  })

  if (!existing) {
    console.error(`❌ לא נמצא רישום עבור ${phone}`)
    return false
  }

  if (existing.payment_status === 'bit') {
    console.log(`⚠️ ${existing.name} כבר מסומן כמשלם`)
    return true
  }

  const { error: updateError } = await supabase
    .from('workshop_registrations')
    .update({ payment_status: 'bit' })
    .eq('id', existing.id)

  if (updateError) {
    console.error('Error updating:', updateError)
    return false
  }

  console.log(`✅ ${existing.name} עודכן כמשלם`)

  if (sendMessage) {
    const chatId = formatPhoneForWhatsApp(phone)
    console.log(`📱 שולח קישור לזום...`)

    const sent = await sendWhatsAppMessage(chatId, getZoomLinkMessage())
    if (sent) {
      console.log(`✅ הודעה נשלחה`)
    } else {
      console.log(`❌ שגיאה בשליחה`)
    }
  }

  // Create invoice
  const today = new Date().toISOString().split('T')[0]
  console.log(`📄 יוצר חשבונית...`)
  const invoiceResult = await createInvoice(existing.name, existing.email, existing.phone || phone, today)
  if (invoiceResult.success) {
    console.log(`✅ חשבונית ${invoiceResult.invoiceNumber} נוצרה`)
  } else {
    console.log(`❌ שגיאה בחשבונית: ${invoiceResult.error}`)
  }

  return true
}

// Invoice creation
async function createInvoice(name: string, email: string, phone: string, paymentDate: string): Promise<{ success: boolean; invoiceNumber?: string; error?: string }> {
  if (!MORNING_API_KEY) {
    return { success: false, error: 'Missing MORNING_API_KEY' }
  }

  // Get JWT token
  const authResponse = await fetch(`${MORNING_BASE_URL}/account/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: MORNING_API_KEY, secret: MORNING_API_SECRET }),
  })

  if (!authResponse.ok) {
    return { success: false, error: 'Failed to get JWT token' }
  }

  const authData = await authResponse.json() as { token?: string }
  const token = authData.token

  if (!token) {
    return { success: false, error: 'No token received' }
  }

  const today = new Date().toISOString().split('T')[0]
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const requestBody = {
    description: WORKSHOP_TITLE,
    remarks: `חשבונית עבור ${name}`,
    type: 320,
    date: today,
    dueDate,
    lang: 'he',
    currency: 'ILS',
    vatType: 0,
    rounding: true,
    signed: true,
    attachment: true,
    client: {
      name,
      emails: [email],
      phone,
      add: true,
      self: false,
    },
    income: [{
      description: WORKSHOP_DESCRIPTION,
      quantity: 1,
      price: AMOUNT,
      currency: 'ILS',
      currencyRate: 1,
      vatType: 1,
    }],
    payment: [{
      date: paymentDate,
      type: 10,
      price: AMOUNT,
      currency: 'ILS',
      currencyRate: 1,
      appType: 1,
    }],
  }

  try {
    const response = await fetch(`${MORNING_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: errorText }
    }

    const result = await response.json() as { number?: string }
    return { success: true, invoiceNumber: result.number }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// Main
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'add':
    // npx ts-node manage-registrations.ts add "שם" "email@example.com" "054-1234567" [paid]
    const [, name, email, phone, status] = args
    if (!name || !email || !phone) {
      console.log('Usage: npx ts-node manage-registrations.ts add "שם" "email" "phone" [paid]')
      process.exit(1)
    }
    addRegistration(name, email, phone, status === 'paid')
    break

  case 'paid':
    // npx ts-node manage-registrations.ts paid "054-1234567"
    const phoneToMark = args[1]
    if (!phoneToMark) {
      console.log('Usage: npx ts-node manage-registrations.ts paid "phone"')
      process.exit(1)
    }
    markAsPaid(phoneToMark)
    break

  case 'list':
    // npx ts-node manage-registrations.ts list
    listRegistrations()
    break

  case 'send-all-zoom':
    // npx ts-node manage-registrations.ts send-all-zoom
    sendZoomToAllPaid()
    break

  default:
    console.log(`
📋 סקריפט ניהול הרשמות לסדנת קלודוש

פקודות:
  add "שם" "email" "phone" [paid]  - הוסף רישום חדש (אופציונלי: paid אם כבר שילם)
  paid "phone"                      - סמן מישהו כמשלם ושלח לו קישור
  list                              - הצג את כל הרשומים
  send-all-zoom                     - שלח קישור זום לכל מי ששילם

דוגמאות:
  npx ts-node manage-registrations.ts add "דוד הלל" "david@example.com" "054-6709677"
  npx ts-node manage-registrations.ts add "דוד הלל" "david@example.com" "054-6709677" paid
  npx ts-node manage-registrations.ts paid "054-6709677"
  npx ts-node manage-registrations.ts list
  npx ts-node manage-registrations.ts send-all-zoom
`)
}
