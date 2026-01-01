import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lrhdriqwteyeelvxipet.supabase.co',
  'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'
)

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }

  return '972' + digits
}

async function fix() {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', 'claude-code-amaleh-2026-01-01')

  if (error || !data) {
    console.error('Error:', error)
    return
  }

  // Group by normalized phone
  const byPhone: Record<string, typeof data> = {}

  for (const row of data) {
    const normalized = normalizePhone(row.phone)
    if (!byPhone[normalized]) {
      byPhone[normalized] = []
    }
    byPhone[normalized].push(row)
  }

  console.log('Processing duplicates and fixing normalized_phone...\n')

  for (const [phone, rows] of Object.entries(byPhone)) {
    if (rows.length > 1) {
      // Find if any is "bit" or has real name
      const bitRow = rows.find(r => r.payment_status === 'bit')
      const realRow = rows.find(r => r.name !== 'Manual Entry' && r.name !== 'test' && r.name !== 'Test User')

      // Keep the real one, update it to bit if needed
      const keepRow = realRow || rows[0]
      const deleteRows = rows.filter(r => r.id !== keepRow.id)

      console.log(`${phone}: ${rows.length} entries`)
      console.log(`  Keeping: ${keepRow.name} (id: ${keepRow.id})`)

      // Update kept row
      const { error: updateError } = await supabase
        .from('workshop_registrations')
        .update({
          normalized_phone: phone,
          payment_status: bitRow ? 'bit' : keepRow.payment_status
        })
        .eq('id', keepRow.id)

      if (updateError) {
        console.log(`  ❌ Update error: ${updateError.message}`)
      } else {
        console.log(`  ✅ Updated normalized_phone to ${phone}, status: ${bitRow ? 'bit' : keepRow.payment_status}`)
      }

      // Delete duplicates
      for (const delRow of deleteRows) {
        const { error: delError } = await supabase
          .from('workshop_registrations')
          .delete()
          .eq('id', delRow.id)

        if (delError) {
          console.log(`  ❌ Delete error for ${delRow.name}: ${delError.message}`)
        } else {
          console.log(`  🗑️ Deleted duplicate: ${delRow.name}`)
        }
      }
      console.log('')
    } else {
      // Single entry - just fix normalized_phone
      const row = rows[0]
      if (row.normalized_phone !== phone) {
        const { error: updateError } = await supabase
          .from('workshop_registrations')
          .update({ normalized_phone: phone })
          .eq('id', row.id)

        if (updateError) {
          console.log(`${row.name}: ❌ ${updateError.message}`)
        } else {
          console.log(`${row.name}: ✅ ${row.normalized_phone} -> ${phone}`)
        }
      }
    }
  }

  console.log('\n--- Final state ---')
  const { data: final } = await supabase
    .from('workshop_registrations')
    .select('name, phone, normalized_phone, payment_status')
    .eq('workshop_name', 'claude-code-amaleh-2026-01-01')
    .order('name')

  final?.forEach((r, i) => {
    const status = r.payment_status === 'bit' ? '💰' : '⏳'
    console.log(`${status} ${r.name} | ${r.normalized_phone}`)
  })
}

fix()
