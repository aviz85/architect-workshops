import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../../../../.claude/skills/morning-invoice/scripts/.env') })

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'
const WORKSHOP_NAME = 'claudosh-agent-2026-01-06'
const WORKSHOP_TITLE = 'סדנת קלודוש הסוכן המטורף'
const WORKSHOP_DESCRIPTION = 'סדנת קלודוש הסוכן המטורף - 6.1.26'
const AMOUNT = 50

const GREEN_API_URL = 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = '7103160388'
const GREEN_API_TOKEN = '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

const MORNING_API_KEY = process.env.MORNING_API_KEY || ''
const MORNING_API_SECRET = process.env.MORNING_API_SECRET || ''
const MORNING_BASE_URL = process.env.MORNING_BASE_URL || 'https://api.greeninvoice.co.il/api/v1'

const MESSAGE = `מעולה! התשלום התקבל ✅

הנה הקישור לסדנה *קלודוש הסוכן המטורף*:

🔗 https://claudosh.master-x.co.il/watch-q3x7z

🕘 יום שלישי 6.1.26 בשעה 21:00
⏰ כדאי להיכנס כמה דקות לפני

במידה ויש בעיה להיכנס לקישור, הנה קישור ישיר לזום:
https://us06web.zoom.us/j/85374512520?pwd=SeNeeFB4Uznkjq0zImONKbSGkri7iD.1

כדאי להיכנס מוקדם לתפוס מקום. אם יתמלא הזום נשים בקישור למעלה את הקישור ליוטיוב לייב

נתראה! 🚀
אביץ - הארכיטקט`

// New payments from Bit images
const newPayments = [
  { name: 'עזרא לוי', phone: '054-4266802' },
  { name: 'צבי ויכטר', phone: '054-7207283' },
  { name: 'אלי גליק', phone: '058-4582243' },
  { name: 'אילן מלמד', phone: '054-7614160' },
  { name: 'שלמה נויפלד', phone: '054-5395699' },
  { name: 'יוסף גטהון', phone: '052-5899132' },
  { name: 'דביר גולן', phone: '050-4533388' },
  { name: 'צחי ברדה', phone: '054-9992699' },
  { name: 'קמחי נמרוד', phone: '052-6333366' },
  { name: 'רועי בלזם', phone: '054-4594703' },
  { name: 'עמרם אנגלנדר', phone: '054-8009404' },
  { name: 'ליאור אלקן', phone: '058-6343336' },
  { name: 'דוד שילוח', phone: '052-8083074' },
  { name: 'אלעזר ריגר', phone: '052-5624350' },
  { name: 'אלי שוורצר', phone: '050-6298122' },
  { name: 'שלום קדוש', phone: '053-5316342' },
  { name: 'אסתר קליין', phone: '054-4862465' },
]

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) digits = digits.substring(3)
  else if (digits.startsWith('0')) digits = digits.substring(1)
  return '972' + digits
}

function formatPhoneForWhatsApp(phone: string): string {
  return normalizePhone(phone) + '@c.us'
}

async function sendWhatsApp(phone: string): Promise<boolean> {
  const chatId = formatPhoneForWhatsApp(phone)
  try {
    const response = await fetch(
      `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message: MESSAGE }),
      }
    )
    const data = await response.json()
    return response.ok && data.idMessage
  } catch {
    return false
  }
}

async function getToken(): Promise<string | null> {
  const response = await fetch(MORNING_BASE_URL + '/account/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: MORNING_API_KEY, secret: MORNING_API_SECRET }),
  })
  if (!response.ok) return null
  const data = await response.json() as { token?: string }
  return data.token || null
}

async function createInvoice(token: string, name: string, email: string, phone: string): Promise<string | null> {
  const today = new Date().toISOString().split('T')[0]
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const response = await fetch(MORNING_BASE_URL + '/documents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
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
      client: { name, emails: [email], phone, add: true, self: false },
      income: [{ description: WORKSHOP_DESCRIPTION, quantity: 1, price: AMOUNT, currency: 'ILS', currencyRate: 1, vatType: 1 }],
      payment: [{ date: today, type: 10, price: AMOUNT, currency: 'ILS', currencyRate: 1, appType: 1 }],
    }),
  })

  if (!response.ok) return null
  const result = await response.json() as { number?: string }
  return result.number || null
}

function randomDelay(minSec: number, maxSec: number): number {
  return Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const token = await getToken()

  if (!token) {
    console.error('❌ Failed to get Morning token')
    return
  }

  // Get existing registrations
  const { data: existing } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  const toProcess: typeof newPayments = []
  const alreadyPaid: string[] = []

  for (const p of newPayments) {
    const normalized = normalizePhone(p.phone)
    const last7 = p.phone.replace(/\D/g, '').slice(-7)

    const found = existing?.find(e => {
      const eDigits = (e.phone || '').replace(/\D/g, '')
      return e.normalized_phone === normalized ||
             eDigits.endsWith(last7) ||
             e.normalized_phone?.endsWith(last7)
    })

    if (found && found.payment_status === 'bit') {
      alreadyPaid.push(p.name)
    } else {
      toProcess.push(p)
    }
  }

  console.log(`\n=== כבר שילמו (${alreadyPaid.length}) ===`)
  alreadyPaid.forEach(n => console.log(`⏭️ ${n}`))

  console.log(`\n=== לעיבוד (${toProcess.length}) ===\n`)

  let processed = 0
  for (let i = 0; i < toProcess.length; i++) {
    const p = toProcess[i]
    const normalized = normalizePhone(p.phone)

    console.log(`[${i + 1}/${toProcess.length}] ${p.name} (${p.phone})`)

    // Check if exists
    const { data: reg } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('workshop_name', WORKSHOP_NAME)
      .or(`normalized_phone.eq.${normalized},phone.ilike.%${p.phone.replace(/\D/g, '').slice(-7)}%`)
      .single()

    let email = 'bit-payment@manual.entry'

    if (reg) {
      // Update existing
      email = reg.email || email
      await supabase
        .from('workshop_registrations')
        .update({ payment_status: 'bit' })
        .eq('id', reg.id)
      console.log(`   ✅ עודכן בDB`)
    } else {
      // Insert new
      await supabase
        .from('workshop_registrations')
        .insert({
          name: p.name,
          phone: p.phone,
          email,
          normalized_phone: normalized,
          workshop_name: WORKSHOP_NAME,
          payment_status: 'bit',
          marketing_consent: false,
          is_waitlist: false,
          notes: 'Added from Bit payment',
        })
      console.log(`   ✅ נוסף לDB`)
    }

    // Send WhatsApp
    const sent = await sendWhatsApp(p.phone)
    console.log(sent ? `   📱 WhatsApp נשלח` : `   ❌ WhatsApp נכשל`)

    // Create invoice
    const invNum = await createInvoice(token, p.name, email, p.phone)
    console.log(invNum ? `   🧾 חשבונית ${invNum}` : `   ❌ חשבונית נכשלה`)

    processed++

    // Wait 1-3 minutes before next (except last)
    if (i < toProcess.length - 1) {
      const delay = randomDelay(60, 180)
      console.log(`   ⏳ ממתין ${Math.round(delay / 1000)} שניות...\n`)
      await sleep(delay)
    }
  }

  console.log(`\n========================================`)
  console.log(`📊 סיכום: ${processed} עובדו`)
  console.log(`========================================\n`)
}

main()
