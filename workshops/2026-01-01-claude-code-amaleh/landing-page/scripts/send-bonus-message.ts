import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'
const WATCH_PAGE_URL = 'https://ima.master-x.co.il/watch-k8m2p'

// Green API config
const GREEN_API_URL = 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = '7103160388'
const GREEN_API_TOKEN = '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }
  return '972' + digits
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

const MESSAGE = `היי! 👋

תודה רבה על ההשתתפות בסדנת *קלוד קוד אמאל׳ה*! 🎉

יש לי בשורה טובה - ביום *שלישי 6.1.26 בשעה 21:00* תתקיים סדנה נוספת שחוזרת על אותם עקרונות שדיברנו, בצורה יותר מסודרת וחדה 🚀

כמשתתפי הסדנה - אתם מוזמנים להצטרף בחינם!
אם רציתם עוד חידוד על החומר - זו ההזדמנות.

🔗 הקישור לזום:
${WATCH_PAGE_URL}

📹 ההקלטה תהיה זמינה אחרי יום שלישי.

נתראה! 🙏
אביץ - הארכיטקט`

async function main() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get all paid participants from amaleh workshop
  const { data: paidParticipants, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)
    .eq('payment_status', 'bit')

  if (error) {
    console.error('Error fetching:', error)
    return
  }

  console.log(`נמצאו ${paidParticipants?.length || 0} משתתפים ששילמו לאמאל׳ה\n`)

  if (process.argv[2] === 'dry') {
    console.log('=== DRY RUN - לא שולח הודעות ===\n')
    for (const p of paidParticipants || []) {
      console.log(`  📱 ${p.name} - ${p.phone}`)
    }
    console.log('\nלשליחה אמיתית הרץ: npx ts-node send-bonus-message.ts send')
    return
  }

  if (process.argv[2] !== 'send') {
    console.log('Usage:')
    console.log('  npx ts-node send-bonus-message.ts dry   - הצג רשימה בלי לשלוח')
    console.log('  npx ts-node send-bonus-message.ts send  - שלח הודעות')
    return
  }

  console.log('=== שולח הודעות ===\n')

  let sent = 0
  let failed = 0

  for (const p of paidParticipants || []) {
    const phone = p.phone || p.normalized_phone
    if (!phone) {
      console.log(`❌ ${p.name} - אין טלפון`)
      failed++
      continue
    }

    const chatId = normalizePhone(phone) + '@c.us'
    console.log(`📱 שולח ל-${p.name} (${phone})...`)

    const success = await sendWhatsAppMessage(chatId, MESSAGE)

    if (success) {
      console.log(`   ✅ נשלח`)
      sent++
    } else {
      console.log(`   ❌ נכשל`)
      failed++
    }

    // Random delay 5-10 seconds between messages
    const delay = 5000 + Math.random() * 5000
    await new Promise(r => setTimeout(r, delay))
  }

  console.log(`\n=== סיכום ===`)
  console.log(`✅ נשלחו: ${sent}`)
  console.log(`❌ נכשלו: ${failed}`)
}

main()
