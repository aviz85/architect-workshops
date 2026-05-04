import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }
  return digits
}

async function matchRegistrations() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get ALL registrations for this workshop
  const { data: registrations, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Total registrations: ${registrations?.length}\n`)

  // Group by normalized phone
  const byPhone = new Map<string, any[]>()

  for (const reg of registrations || []) {
    const normalized = normalizePhone(reg.phone || reg.normalized_phone || '')
    if (!normalized) continue

    if (!byPhone.has(normalized)) {
      byPhone.set(normalized, [])
    }
    byPhone.get(normalized)!.push(reg)
  }

  console.log(`Unique phone numbers: ${byPhone.size}\n`)

  // Find Bit payers without real emails
  const bitPayers = (registrations || []).filter(r => r.payment_status === 'bit')
  console.log(`Bit payers: ${bitPayers.length}\n`)

  // Check each Bit payer
  let matchedCount = 0
  let noMatchCount = 0
  const updates: { id: string; name: string; email: string }[] = []

  console.log('=== MATCHING RESULTS ===\n')

  for (const payer of bitPayers) {
    const normalized = normalizePhone(payer.phone || payer.normalized_phone || '')
    const allWithPhone = byPhone.get(normalized) || []

    // Find a registration with real email (not manual)
    const realReg = allWithPhone.find(r =>
      r.email &&
      !r.email.includes('manual@entry') &&
      !r.email.includes('bit-payment@') &&
      r.email.includes('@') &&
      r.id !== payer.id
    )

    const hasRealEmail = payer.email &&
      !payer.email.includes('manual@entry') &&
      !payer.email.includes('bit-payment@')

    if (hasRealEmail) {
      // Already has real email
      console.log(`✅ ${payer.name} - ${payer.email}`)
      matchedCount++
    } else if (realReg) {
      // Found a match!
      console.log(`🔄 ${payer.name} (${payer.phone}) -> ${realReg.name} (${realReg.email})`)
      matchedCount++
      updates.push({
        id: payer.id,
        name: realReg.name,
        email: realReg.email
      })
    } else {
      // No match found
      console.log(`❌ ${payer.name} - ${payer.phone} - NO EMAIL FOUND`)
      noMatchCount++
    }
  }

  console.log('\n=== SUMMARY ===')
  console.log(`Has/found email: ${matchedCount}`)
  console.log(`No email found: ${noMatchCount}`)
  console.log(`Updates needed: ${updates.length}`)

  if (updates.length > 0) {
    console.log('\n=== UPDATES TO APPLY ===')
    for (const u of updates) {
      console.log(`  ${u.name} -> ${u.email}`)
    }

    console.log('\nApplying updates...')
    for (const u of updates) {
      const { error: updateError } = await supabase
        .from('workshop_registrations')
        .update({ name: u.name, email: u.email })
        .eq('id', u.id)

      if (updateError) {
        console.error(`Error updating ${u.name}:`, updateError)
      } else {
        console.log(`✅ Updated ${u.name}`)
      }
    }
  }
}

matchRegistrations()
