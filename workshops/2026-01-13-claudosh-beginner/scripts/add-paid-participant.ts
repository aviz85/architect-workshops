import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env from claudosh-agent landing page
dotenv.config({ path: path.join(__dirname, '../../2026-01-06-claudosh-agent/landing-page/.env') })

// ============ WORKSHOP CONFIG ============
const WORKSHOP_NAME = 'claudosh-beginner-2026-01-13'
const WORKSHOP_TITLE = 'קלודוש הסוכן - מתחילים בקטן!'
const WORKSHOP_DATE = 'יום שלישי 13.1.26 בשעה 21:00'
const WATCH_PAGE_URL = 'https://claudosh.master-x.co.il/watch-x7m3p'
const ZOOM_LINK = 'https://us06web.zoom.us/j/81637723179?pwd=Rdhjj55bbTnmN9vtP2wDxNIuJp6820.1'
// ==========================================

// Supabase
const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

// Green API (WhatsApp)
const GREEN_API_URL = process.env.GREEN_API_URL || 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = process.env.GREEN_API_INSTANCE || '7103160388'
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN || '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }
  return '972' + digits
}

async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  const chatId = normalizePhone(phone) + '@c.us'
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

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0]
}

function getWelcomeMessage(name: string): string {
  return `היי ${getFirstName(name)}! 👋

תודה רבה על ההרשמה לסדנה *${WORKSHOP_TITLE}* 🎉

ברוך הבא! הסדנה תתקיים ב${WORKSHOP_DATE}.

🔗 הלינק לכניסה לסדנה:
${WATCH_PAGE_URL}

נתראה! 💪
אביץ`
}

function getFollowUpMessage(): string {
  return `אגב, אם יש בעיה להיכנס לקישור - הנה קישור ישיר לזום:
${ZOOM_LINK}

בקישור למעלה תופיע גם ההקלטה לאחר השידור 🎬`
}

async function addParticipant(name: string, email: string, phone: string, sendMessages: boolean = true) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedPhone = normalizePhone(phone)

  // Check if exists
  const { data: existing } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('normalized_phone', normalizedPhone)
    .eq('workshop_name', WORKSHOP_NAME)
    .single()

  if (existing) {
    console.log(`⚠️ ${name} already exists in DB`)
  } else {
    // Add to Supabase
    const { error } = await supabase
      .from('workshop_registrations')
      .insert({
        name,
        email,
        phone,
        normalized_phone: normalizedPhone,
        workshop_name: WORKSHOP_NAME,
        payment_status: 'paid',
        marketing_consent: false,
        is_waitlist: false,
        notes: 'Manual entry - paid',
      })

    if (error) {
      console.log(`❌ DB Error for ${name}: ${error.message}`)
    } else {
      console.log(`✅ DB: Added ${name}`)
    }
  }

  // Send WhatsApp messages
  if (sendMessages) {
    console.log(`📱 Sending welcome message to ${name}...`)
    const welcomeSent = await sendWhatsAppMessage(phone, getWelcomeMessage(name))
    console.log(welcomeSent ? `   ✅ Welcome sent` : `   ❌ Welcome failed`)

    // Small delay between messages
    await new Promise(r => setTimeout(r, 1000))

    console.log(`📱 Sending follow-up message...`)
    const followUpSent = await sendWhatsAppMessage(phone, getFollowUpMessage())
    console.log(followUpSent ? `   ✅ Follow-up sent` : `   ❌ Follow-up failed`)
  }
}

async function listParticipants() {
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

  console.log(`\n=== ${WORKSHOP_TITLE} ===\n`)
  console.log(`📊 Total: ${data?.length || 0} participants\n`)

  for (const r of data || []) {
    console.log(`  ✅ ${r.name} | ${r.phone} | ${r.email}`)
  }
}

// Main
const args = process.argv.slice(2)
const command = args[0]

switch (command) {
  case 'add':
    // npx ts-node add-paid-participant.ts add "שם" "email@example.com" "054-1234567"
    const [, name, email, phone] = args
    if (!name || !email || !phone) {
      console.log('Usage: npx ts-node add-paid-participant.ts add "שם" "email" "phone"')
      process.exit(1)
    }
    addParticipant(name, email, phone)
    break

  case 'add-silent':
    // Add to DB only, no WhatsApp messages
    const [, name2, email2, phone2] = args
    if (!name2 || !email2 || !phone2) {
      console.log('Usage: npx ts-node add-paid-participant.ts add-silent "שם" "email" "phone"')
      process.exit(1)
    }
    addParticipant(name2, email2, phone2, false)
    break

  case 'list':
    listParticipants()
    break

  default:
    console.log(`
📋 Add Paid Participant - ${WORKSHOP_TITLE}

Commands:
  add "שם" "email" "phone"        - Add participant + send WhatsApp messages
  add-silent "שם" "email" "phone" - Add to DB only (no messages)
  list                             - List all participants

Examples:
  npx ts-node add-paid-participant.ts add "גבריאל בן חיים" "gavriel@gmail.com" "0501234567"
  npx ts-node add-paid-participant.ts add-silent "דוד כהן" "david@gmail.com" "0541234567"
  npx ts-node add-paid-participant.ts list
`)
}
