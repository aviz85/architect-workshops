import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const GREEN_API_URL = 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = '7103160388'
const GREEN_API_TOKEN = '5ecaf510002844d787ddcc34ad6a58af92666328c19843a382'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) digits = digits.substring(3)
  else if (digits.startsWith('0')) digits = digits.substring(1)
  return '972' + digits
}

function formatPhoneForWhatsApp(phone: string): string {
  return normalizePhone(phone) + '@c.us'
}

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

// The 28 phones that need messages
const phonesToSend = [
  { name: 'אפרים איתם', phone: '054-7501782' },
  { name: 'אלי בראמי', phone: '052-2915268' },
  { name: 'Tehila Malka', phone: '050-9509108' },
  { name: 'ברק ביתן', phone: '054-2342289' },
  { name: 'Doron Har Noy', phone: '050-8323459' },
  { name: 'עידו וייזר', phone: '050-4061944' },
  { name: 'יאיר יששכר', phone: '052-8974846' },
  { name: 'Arie Hadad', phone: '052-5908737' },
  { name: 'אבי קובי', phone: '058-4709148' },
  { name: 'אלישיב לויתן', phone: '054-6202115' },
  { name: 'נועם סליט', phone: '050-9010290' },
  { name: 'מעוז ברקאי', phone: '054-4932175' },
  { name: 'אבי כהן', phone: '052-8555584' },
  { name: 'יהונתן בן דוד', phone: '052-4456576' },
  { name: 'zalman sonenfeld', phone: '052-9526517' },
  { name: 'גיא אגא', phone: '052-5256688' },
  { name: 'אייל קרן', phone: '054-4915998' },
  { name: 'נדב בן פזי', phone: '054-5445117' },
  { name: 'גילטל צבר', phone: '054-8016456' },
  { name: 'ליאור שינמל', phone: '052-3060686' },
  { name: 'איתי מילטף', phone: '052-3726767' },
  { name: 'רועי בנימיני', phone: '050-7121260' },
  { name: 'תומר', phone: '050-4058300' },
  { name: 'Itamar Stahl', phone: '052-6896333' },
  { name: 'נאוה', phone: '053-6221967' },
  { name: 'איתי סבי', phone: '052-8907389' },
  { name: 'Moshe Lev Ari', phone: '050-8668871' },
  { name: 'דוד פרטוש', phone: '053-5285270' },
]

async function sendWhatsApp(chatId: string): Promise<boolean> {
  try {
    const url = `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message: MESSAGE }),
    })
    const data = await response.json()
    return response.ok && data.idMessage
  } catch (error) {
    console.error('Error:', error)
    return false
  }
}

function randomDelay(minSec: number, maxSec: number): number {
  return Math.floor(Math.random() * (maxSec - minSec + 1) + minSec) * 1000
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function sendAll() {
  console.log(`\n🚀 מתחיל לשלוח ל-${phonesToSend.length} אנשים...\n`)
  console.log(`⏱️ פערים של 60-180 שניות בין הודעות\n`)

  let sent = 0
  let failed = 0

  for (let i = 0; i < phonesToSend.length; i++) {
    const { name, phone } = phonesToSend[i]
    const chatId = formatPhoneForWhatsApp(phone)

    console.log(`[${i + 1}/${phonesToSend.length}] שולח ל-${name} (${phone})...`)

    const success = await sendWhatsApp(chatId)

    if (success) {
      sent++
      console.log(`   ✅ נשלח!`)
    } else {
      failed++
      console.log(`   ❌ נכשל`)
    }

    // Wait before next message (except for last one)
    if (i < phonesToSend.length - 1) {
      const delay = randomDelay(60, 180)
      const delaySec = Math.round(delay / 1000)
      console.log(`   ⏳ ממתין ${delaySec} שניות...\n`)
      await sleep(delay)
    }
  }

  console.log(`\n========================================`)
  console.log(`📊 סיכום:`)
  console.log(`   ✅ נשלחו: ${sent}`)
  console.log(`   ❌ נכשלו: ${failed}`)
  console.log(`========================================\n`)
}

sendAll()
