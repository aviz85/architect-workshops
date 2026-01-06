import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'
const AMOUNT = 50
const PAYMENT_DATE = '2026-01-01' // Workshop date (last Thursday)

async function prepareInvoiceTable() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get all Bit payers
  const { data: registrations, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('workshop_name', WORKSHOP_NAME)
    .eq('payment_status', 'bit')
    .order('name')

  if (error) {
    console.error('Error fetching registrations:', error)
    return
  }

  console.log(`\n# Invoice Preparation - סדנת קלוד קוד אמאלה`)
  console.log(`\nTotal Bit payers: ${registrations?.length || 0}`)
  console.log(`Amount per invoice: ${AMOUNT} NIS`)
  console.log(`Payment date: ${PAYMENT_DATE}`)
  console.log(`Total amount: ${(registrations?.length || 0) * AMOUNT} NIS\n`)

  console.log('| # | Name | Phone | Email | Amount | Status |')
  console.log('|---|------|-------|-------|--------|--------|')

  let validCount = 0
  let missingEmailCount = 0
  const invoiceData: any[] = []

  registrations?.forEach((reg, index) => {
    const hasValidEmail = reg.email &&
      !reg.email.includes('manual@entry') &&
      !reg.email.includes('bit-payment@') &&
      reg.email.includes('@')

    const status = hasValidEmail ? '✅ Ready' : '⚠️ No email'

    if (hasValidEmail) {
      validCount++
    } else {
      missingEmailCount++
    }

    console.log(`| ${index + 1} | ${reg.name} | ${reg.phone} | ${reg.email || 'N/A'} | ${AMOUNT} | ${status} |`)

    invoiceData.push({
      id: index + 1,
      name: reg.name,
      phone: reg.phone,
      email: reg.email,
      amount: AMOUNT,
      title: 'סדנת קלוד קוד אמאלה',
      description: 'סדנת קלוד קוד אמאלה 1.1.26',
      paymentMethod: 'ביט',
      paymentDate: PAYMENT_DATE,
      hasValidEmail
    })
  })

  console.log('\n## Summary')
  console.log(`- Ready to invoice: ${validCount}`)
  console.log(`- Missing/invalid email: ${missingEmailCount}`)
  console.log(`- Total: ${registrations?.length || 0}`)

  // Save to JSON for later use
  const fs = await import('fs')
  const path = await import('path')

  const outputPath = path.join(__dirname, 'pending-invoices.json')
  fs.writeFileSync(outputPath, JSON.stringify(invoiceData, null, 2))
  console.log(`\nData saved to: ${outputPath}`)
}

prepareInvoiceTable()
