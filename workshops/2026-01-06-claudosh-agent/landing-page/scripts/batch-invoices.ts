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

const MORNING_API_KEY = process.env.MORNING_API_KEY || ''
const MORNING_API_SECRET = process.env.MORNING_API_SECRET || ''
const MORNING_BASE_URL = process.env.MORNING_BASE_URL || 'https://api.greeninvoice.co.il/api/v1'

// People who need invoices (emails)
const needInvoiceEmails = [
  'liorshin@gmai.com',
  'maozb2000@gmail.com',
  'ido143ido@gmail.com',
  'limormd@gmail.com',
  'ephraim.eitam@gmail.com',
  'elli@post.bgu.ac.il',
  'tehila@cnwd-erpl.com',
  'barakb20@gmail.com',
  'doron0220@gmail.com',
  'yairiss@gmail.com',
  'ariehad@gmail.com',
  'avi@avi-kubi.co.il',
  'elyash@gmail.com',
  'nsalit@gmail.com',
  'neter145@gmail.com',
  'nadav530@gmail.com',
  'yonatabd@gmail.com',
  'zalmi26@gmail.com',
  'guy@beeu.co.il',
  'eylkrn@yahoo.com',
  'giltal.tzabar@gmail.com',
  'itay.machlof@gmail.com',
  'roy1077@gmail.com',
  'itasmar@gmail.com',
  'tomspatz@gmail.com',
  'navnuv1997@gmail.com',
  'itaisabi@gmail.com',
  'partushdavid@gmail.com',
  'levarimoshe@gmail.com',
  'yossef.media@gmail.com',
]

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

async function createInvoice(token: string, name: string, email: string, phone: string): Promise<{ success: boolean; number?: string; error?: string }> {
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
      date: today,
      type: 10,
      price: AMOUNT,
      currency: 'ILS',
      currencyRate: 1,
      appType: 1,
    }],
  }

  try {
    const response = await fetch(MORNING_BASE_URL + '/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return { success: false, error: errorText }
    }

    const result = await response.json() as { number?: string }
    return { success: true, number: result.number }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

async function main() {
  console.log('🧾 יוצר חשבוניות...\n')

  const token = await getToken()
  if (!token) {
    console.error('❌ Failed to get Morning token')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: paid } = await supabase
    .from('workshop_registrations')
    .select('name, email, phone')
    .eq('workshop_name', WORKSHOP_NAME)
    .eq('payment_status', 'bit')

  let created = 0
  let failed = 0

  for (const email of needInvoiceEmails) {
    const person = paid?.find(p => p.email?.toLowerCase() === email.toLowerCase())

    if (!person) {
      console.log(`⏭️ לא נמצא: ${email}`)
      continue
    }

    console.log(`[${created + failed + 1}/30] יוצר חשבונית ל-${person.name}...`)

    const result = await createInvoice(token, person.name, person.email, person.phone || '')

    if (result.success) {
      created++
      console.log(`   ✅ חשבונית ${result.number}`)
    } else {
      failed++
      console.log(`   ❌ שגיאה: ${result.error?.substring(0, 100)}`)
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n========================================`)
  console.log(`📊 סיכום:`)
  console.log(`   ✅ נוצרו: ${created}`)
  console.log(`   ❌ נכשלו: ${failed}`)
  console.log(`========================================\n`)
}

main()
