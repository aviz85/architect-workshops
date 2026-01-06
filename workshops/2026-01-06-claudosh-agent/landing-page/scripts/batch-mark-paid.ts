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

const paidPhones = [
  '054-7501782',  // אפרים איתם
  '052-2915268',  // אלי בראמי
  '050-9509108',  // תהילה מלכה
  '054-2342289',  // ברק ביתן
  '050-8323459',  // דורון הר נוי
  '050-4061944',  // עידו וייזר
  '052-8974846',  // יאיר יששכר
  '052-5908737',  // אריה חדד
  '058-4709148',  // אבי קובי
  '054-6202115',  // אלישיב לויתן
  '050-9010290',  // נועם סליט
  '054-4932175',  // מעוז ברקאי
  '052-8555584',  // אבי כהן
  '052-4456576',  // יהונתן בן דוד
  '052-9526517',  // זלמן זוננפלד
  '052-5256688',  // גיא אגא
  '054-4915998',  // אייל קרן
  '054-5445117',  // נדב בן פזי
  '054-8016456',  // גיל-טל צבר
  '052-3060686',  // ליאור שינמל
  '052-3726767',  // איתי מחלוף
  '050-7121260',  // רועי בנימיני
  '050-4058300',  // תומר שפץ
  '052-6896333',  // איתמר שטאל
  '053-6221967',  // נאוה חביב
  '052-8907389',  // איתי סבי
  '050-8668871',  // משה לב ארי
  '053-5285270',  // דוד פרטוש
]

async function batchMarkPaid() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get all registrations for this workshop
  const { data: allRegs, error: fetchError } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  if (fetchError || !allRegs) {
    console.error('Error fetching registrations:', fetchError)
    return
  }

  const updated: string[] = []
  const alreadyPaid: string[] = []
  const notFound: string[] = []

  for (const phone of paidPhones) {
    const digits = phone.replace(/\D/g, '')
    const normalized = normalizePhone(phone)
    const last7 = digits.slice(-7)

    // Find matching registration
    const reg = allRegs.find(r => {
      const regDigits = (r.phone || '').replace(/\D/g, '')
      const regNormalized = r.normalized_phone || ''
      return regNormalized === normalized ||
             regDigits.endsWith(last7) ||
             regNormalized.endsWith(last7)
    })

    if (!reg) {
      notFound.push(phone)
      continue
    }

    if (reg.payment_status === 'bit') {
      alreadyPaid.push(`${reg.name} (${phone})`)
      continue
    }

    const { error: updateError } = await supabase
      .from('workshop_registrations')
      .update({ payment_status: 'bit' })
      .eq('id', reg.id)

    if (!updateError) {
      updated.push(`${reg.name} (${phone})`)
    }
  }

  console.log('\n=== עודכנו כמשלמים ===')
  updated.forEach(u => console.log(`✅ ${u}`))
  console.log(`סה"כ: ${updated.length}`)

  console.log('\n=== כבר היו מסומנים כמשלמים ===')
  alreadyPaid.forEach(a => console.log(`⏭️ ${a}`))
  console.log(`סה"כ: ${alreadyPaid.length}`)

  if (notFound.length > 0) {
    console.log('\n=== לא נמצאו ===')
    notFound.forEach(n => console.log(`❌ ${n}`))
  }

  console.log(`\n📊 סיכום: ${updated.length} עודכנו, ${alreadyPaid.length} כבר שילמו, ${notFound.length} לא נמצאו`)
}

batchMarkPaid()
