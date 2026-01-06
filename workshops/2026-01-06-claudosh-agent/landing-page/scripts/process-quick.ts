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

const GREEN_API_URL = 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = '7103160388'
const GREEN_API_TOKEN = '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

const MORNING_API_KEY = process.env.MORNING_API_KEY || ''
const MORNING_API_SECRET = process.env.MORNING_API_SECRET || ''
const MORNING_BASE_URL = 'https://api.greeninvoice.co.il/api/v1'

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

const phones = ['0544270026', '0528772084']

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) digits = digits.substring(3)
  else if (digits.startsWith('0')) digits = digits.substring(1)
  return '972' + digits
}

async function sendWhatsApp(phone: string): Promise<boolean> {
  const chatId = normalizePhone(phone) + '@c.us'
  try {
    const response = await fetch(
      `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chatId, message: MESSAGE }) }
    )
    const data = await response.json()
    return response.ok && data.idMessage
  } catch { return false }
}

async function getToken(): Promise<string | null> {
  const response = await fetch(MORNING_BASE_URL + '/account/token', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: MORNING_API_KEY, secret: MORNING_API_SECRET }),
  })
  if (!response.ok) return null
  const data = await response.json() as { token?: string }
  return data.token || null
}

async function createInvoice(token: string, name: string, email: string, phone: string): Promise<string | null> {
  const today = new Date().toISOString().split('T')[0]
  const response = await fetch(MORNING_BASE_URL + '/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({
      description: 'סדנת קלודוש הסוכן המטורף', remarks: `חשבונית עבור ${name}`,
      type: 320, date: today, dueDate: today, lang: 'he', currency: 'ILS', vatType: 0,
      rounding: true, signed: true, attachment: true,
      client: { name, emails: [email], phone, add: true, self: false },
      income: [{ description: 'סדנת קלודוש הסוכן המטורף - 6.1.26', quantity: 1, price: 50, currency: 'ILS', currencyRate: 1, vatType: 1 }],
      payment: [{ date: today, type: 10, price: 50, currency: 'ILS', currencyRate: 1, appType: 1 }],
    }),
  })
  if (!response.ok) return null
  const result = await response.json() as { number?: string }
  return result.number || null
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
function randomDelay() { return Math.floor(Math.random() * (180 - 60 + 1) + 60) * 1000 }

async function main() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const token = await getToken()
  if (!token) { console.error('❌ No token'); return }

  const { data: regs } = await supabase.from('workshop_registrations').select('*').eq('workshop_name', WORKSHOP_NAME)

  for (let i = 0; i < phones.length; i++) {
    const phone = phones[i]
    const last7 = phone.slice(-7)
    const reg = regs?.find(r => r.phone?.includes(last7) || r.normalized_phone?.includes(last7))

    if (!reg) { console.log(`❌ לא נמצא: ${phone}`); continue }

    console.log(`[${i+1}/${phones.length}] ${reg.name} (${phone})`)

    await supabase.from('workshop_registrations').update({ payment_status: 'bit' }).eq('id', reg.id)
    console.log(`   ✅ DB עודכן`)

    const sent = await sendWhatsApp(phone)
    console.log(sent ? `   📱 WhatsApp נשלח` : `   ❌ WhatsApp נכשל`)

    const inv = await createInvoice(token, reg.name, reg.email, phone)
    console.log(inv ? `   🧾 חשבונית ${inv}` : `   ❌ חשבונית נכשלה`)

    if (i < phones.length - 1) {
      const delay = randomDelay()
      console.log(`   ⏳ ממתין ${Math.round(delay/1000)} שניות...\n`)
      await sleep(delay)
    }
  }
  console.log(`\n✅ סיום!`)
}
main()
