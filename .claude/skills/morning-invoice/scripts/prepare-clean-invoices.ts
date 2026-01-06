import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'
const AMOUNT = 50
const PAYMENT_DATE = '2026-01-01'

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }
  return digits
}

async function prepareCleanInvoices() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get ALL registrations
  const { data: registrations, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)

  if (error) {
    console.error('Error:', error)
    return
  }

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

  // For each phone, find the best record (has email + paid via bit)
  const invoiceList: any[] = []
  const missingEmails: any[] = []

  for (const [phone, regs] of byPhone) {
    // Check if any registration is a Bit payer
    const hasBitPayment = regs.some(r => r.payment_status === 'bit')
    if (!hasBitPayment) continue

    // Find the best record with a real email
    const withEmail = regs.find(r =>
      r.email &&
      !r.email.includes('manual@entry') &&
      !r.email.includes('bit-payment@') &&
      r.email.includes('@')
    )

    if (withEmail) {
      invoiceList.push({
        name: withEmail.name,
        phone: withEmail.phone,
        email: withEmail.email,
        amount: AMOUNT,
        title: 'סדנת קלוד קוד אמאלה',
        description: 'סדנת קלוד קוד אמאלה 1.1.26',
        paymentMethod: 'ביט',
        paymentDate: PAYMENT_DATE,
      })
    } else {
      // No email found - use the Bit payer record
      const bitReg = regs.find(r => r.payment_status === 'bit')
      missingEmails.push({
        name: bitReg?.name || 'Unknown',
        phone: phone,
      })
    }
  }

  // Sort by name
  invoiceList.sort((a, b) => a.name.localeCompare(b.name, 'he'))

  console.log(`\n# Clean Invoice List - סדנת קלוד קוד אמאלה`)
  console.log(`\nPayment date: ${PAYMENT_DATE}`)
  console.log(`Amount: ${AMOUNT} NIS`)
  console.log(`\n## Ready to Invoice: ${invoiceList.length}`)
  console.log(`Total: ${invoiceList.length * AMOUNT} NIS\n`)

  console.log('| # | Name | Email | Phone | Amount |')
  console.log('|---|------|-------|-------|--------|')

  invoiceList.forEach((inv, i) => {
    console.log(`| ${i + 1} | ${inv.name} | ${inv.email} | ${inv.phone} | ${AMOUNT} |`)
  })

  if (missingEmails.length > 0) {
    console.log(`\n## Missing Emails: ${missingEmails.length}`)
    missingEmails.forEach(m => {
      console.log(`- ${m.name} (${m.phone})`)
    })
  }

  // Save to JSON
  const outputPath = path.join(__dirname, 'clean-invoice-list.json')
  fs.writeFileSync(outputPath, JSON.stringify({
    paymentDate: PAYMENT_DATE,
    amount: AMOUNT,
    invoices: invoiceList,
    missingEmails: missingEmails
  }, null, 2))

  console.log(`\nSaved to: ${outputPath}`)
}

prepareCleanInvoices()
