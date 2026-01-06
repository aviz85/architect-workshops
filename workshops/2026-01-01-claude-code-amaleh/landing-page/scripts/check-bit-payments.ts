import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }

  return '972' + digits
}

// List of Bit payments
const bitPayments = [
  { name: 'תמיר לוי', phone: '052-7531150' },
  { name: 'נתנאל היבש', phone: '050-4777411' },
  { name: 'מקסים גומברג', phone: '052-8766177' },
  { name: 'אברהם קראוס', phone: '052-8501273' },
  { name: 'יהודה אברשי', phone: '054-2233865' },
  { name: 'רפאל שגב', phone: '052-3354852' },
  { name: 'טל שוקרון', phone: '054-6899244' },
  { name: 'משה אנסבכר', phone: '052-3587990' },
  { name: 'אלישמע שלום הראל וולף', phone: '054-7202550' },
  { name: 'אור פלח', phone: '054-5691051' },
  { name: 'קווינגל ליאקס', phone: '054-5334770' },
  { name: 'יאיר זקס', phone: '054-5396079' },
  { name: 'דביר ביטון', phone: '058-5777177' },
  { name: 'אליסף ריצולסקי', phone: '054-6790448' },
  { name: 'בני רותם', phone: '054-6416524' },
  { name: 'אורי גורדון', phone: '052-6965597' },
  { name: 'אסתי בן עמי', phone: '052-6782026' },
  { name: 'פז יצחק אלקלעי', phone: '052-7823311' },
  { name: 'אליהו אטיאס', phone: '054-4716134' },
  { name: 'ציון כהן', phone: '054-9199344' },
  { name: 'דניאל קורקבדוס', phone: '054-3566686' },
  { name: 'משה פוטר', phone: '053-2815354' },
  { name: 'יונתן אלימלך ברנד', phone: '054-3394766' },
  { name: 'עומר ברנדס', phone: '054-4923441' },
  { name: 'יעקב קרנץ', phone: '052-7906234' },
  { name: 'אמיר שחר', phone: '054-4222733' },
  { name: 'חננאל גולדפינגר', phone: '058-4431939' },
  { name: 'אליה וולפמן', phone: '050-4394292' },
  { name: 'רוברטו גולדרר', phone: '052-6144030' },
  { name: 'יפתח צפריר', phone: '052-9593841' },
  { name: 'רן אייזנשטט', phone: '058-5522220' },
  { name: 'שמואל בנימין שקלובסקי', phone: '058-6487811' },
  { name: 'דוד גנור', phone: '054-7883823' },
  { name: 'יעקב שפירא', phone: '052-6071250' },
  { name: 'אלקנה פרל', phone: '054-7417791' },
  { name: 'דניאל שלום הושיאר', phone: '058-7957770' },
  { name: 'עמי חניא', phone: '054-6702328' },
  { name: 'עמרי גוטליב', phone: '054-8034456' },
  { name: 'משה רוזנס', phone: '052-5594685' },
  { name: 'זכר עדינייב', phone: '050-3533080' },
  { name: 'איל אזולאי', phone: '050-6524093' },
  { name: 'תמיר גפן', phone: '050-6919710' },
  { name: 'יעקב אנניה', phone: '058-6939036' },
  { name: 'דניאל בארון', phone: '054-5609958' },
  { name: 'דותן זבולון', phone: '054-2262993' },
  { name: 'מאור אלימלך', phone: '052-3003897' },
  { name: 'לביא לנדמן', phone: '054-9700136' },
  { name: 'אלי כהן', phone: '054-4785525' },
  { name: 'עדיאל גרוסמרק', phone: '054-7721435' },
  { name: 'בן כהן', phone: '054-9794197' },
  { name: 'שירה ביליג', phone: '054-9260615' },
  { name: 'נפתלי צבי גולדשטיין', phone: '050-5956103' },
  { name: 'עילי שלם', phone: '052-5980027' },
]

async function checkAndAddPayments() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get all registrations for this workshop
  const { data: registrations, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  if (error) {
    console.error('Error fetching registrations:', error)
    return
  }

  console.log(`Found ${registrations?.length || 0} existing registrations\n`)

  // Create a map of normalized phones to registrations
  const existingPhones = new Map<string, any>()
  for (const reg of registrations || []) {
    if (reg.normalized_phone) {
      existingPhones.set(reg.normalized_phone, reg)
    }
  }

  const missing: typeof bitPayments = []
  const alreadyPaid: typeof bitPayments = []
  const needsUpdate: typeof bitPayments = []

  for (const payment of bitPayments) {
    const normalized = normalizePhone(payment.phone)
    const existing = existingPhones.get(normalized)

    if (!existing) {
      missing.push(payment)
    } else if (existing.payment_status === 'bit') {
      alreadyPaid.push(payment)
    } else {
      needsUpdate.push(payment)
    }
  }

  console.log('=== ALREADY PAID (bit) ===')
  for (const p of alreadyPaid) {
    console.log(`✅ ${p.name} - ${p.phone}`)
  }
  console.log(`Total: ${alreadyPaid.length}\n`)

  console.log('=== NEEDS UPDATE (registered but not marked as bit) ===')
  for (const p of needsUpdate) {
    console.log(`🔄 ${p.name} - ${p.phone}`)
  }
  console.log(`Total: ${needsUpdate.length}\n`)

  console.log('=== MISSING (not registered at all) ===')
  for (const p of missing) {
    console.log(`❌ ${p.name} - ${p.phone}`)
  }
  console.log(`Total: ${missing.length}\n`)

  // Ask to update
  if (needsUpdate.length > 0 || missing.length > 0) {
    console.log('--- UPDATING DATABASE ---\n')

    // Update existing registrations
    for (const p of needsUpdate) {
      const normalized = normalizePhone(p.phone)
      const { error: updateError } = await supabase
        .from('workshop_registrations')
        .update({ payment_status: 'bit' })
        .eq('normalized_phone', normalized)
        .eq('workshop_name', WORKSHOP_NAME)

      if (updateError) {
        console.error(`Error updating ${p.name}:`, updateError)
      } else {
        console.log(`✅ Updated ${p.name}`)
      }
    }

    // Insert missing registrations
    for (const p of missing) {
      const normalized = normalizePhone(p.phone)
      const { error: insertError } = await supabase
        .from('workshop_registrations')
        .insert({
          name: p.name,
          phone: p.phone,
          email: 'bit-payment@manual.entry',
          workshop_name: WORKSHOP_NAME,
          normalized_phone: normalized,
          payment_status: 'bit',
          marketing_consent: false,
          is_waitlist: false,
          notes: 'Added from Bit payment list',
        })

      if (insertError) {
        console.error(`Error inserting ${p.name}:`, insertError)
      } else {
        console.log(`✅ Added ${p.name}`)
      }
    }
  }

  console.log('\n=== SUMMARY ===')
  console.log(`Already paid: ${alreadyPaid.length}`)
  console.log(`Updated: ${needsUpdate.length}`)
  console.log(`Added: ${missing.length}`)
  console.log(`Total Bit payments: ${bitPayments.length}`)
}

checkAndAddPayments()
