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

const MORNING_API_KEY = process.env.MORNING_API_KEY || ''
const MORNING_API_SECRET = process.env.MORNING_API_SECRET || ''
const MORNING_BASE_URL = process.env.MORNING_BASE_URL || 'https://api.greeninvoice.co.il/api/v1'

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

async function searchInvoices(token: string) {
  // Search for recent invoices with "קלודוש" in description
  const response = await fetch(MORNING_BASE_URL + '/documents/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      type: [320], // חשבונית מס קבלה
      fromDate: '2025-12-01',
      toDate: '2026-01-31',
      pageSize: 100,
    }),
  })
  
  if (!response.ok) {
    console.error('Search failed:', await response.text())
    return []
  }
  
  const data = await response.json() as { items?: any[] }
  return data.items || []
}

async function main() {
  console.log('🔍 בודק חשבוניות במורנינג...\n')
  
  const token = await getToken()
  if (!token) {
    console.error('Failed to get token')
    return
  }
  
  const invoices = await searchInvoices(token)
  
  // Filter for claudosh workshop
  const claudoshInvoices = invoices.filter((inv: any) => 
    inv.description?.includes('קלודוש') || 
    inv.income?.[0]?.description?.includes('קלודוש')
  )
  
  console.log('=== חשבוניות קלודוש במורנינג ===\n')
  
  if (claudoshInvoices.length === 0) {
    console.log('לא נמצאו חשבוניות לסדנת קלודוש')
  } else {
    for (const inv of claudoshInvoices) {
      console.log('📄 חשבונית ' + inv.number)
      console.log('   ' + inv.client?.name + ' - ' + inv.client?.emails?.[0])
      console.log('   סכום: ' + inv.amount + ' ש"ח')
      console.log('')
    }
    console.log('סה"כ: ' + claudoshInvoices.length + ' חשבוניות')
  }
  
  // Now get paid participants
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const { data: paid } = await supabase
    .from('workshop_registrations')
    .select('name, email, phone')
    .eq('workshop_name', WORKSHOP_NAME)
    .eq('payment_status', 'bit')
  
  console.log('\n=== משתתפים ששילמו (DB) ===\n')
  console.log('סה"כ: ' + (paid?.length || 0))
  
  // Compare
  const invoiceEmails = new Set(claudoshInvoices.map((inv: any) => inv.client?.emails?.[0]?.toLowerCase()))
  
  const withInvoice: string[] = []
  const withoutInvoice: string[] = []
  
  for (const p of paid || []) {
    if (invoiceEmails.has(p.email?.toLowerCase())) {
      withInvoice.push(p.name + ' (' + p.email + ')')
    } else {
      withoutInvoice.push(p.name + ' (' + p.email + ')')
    }
  }
  
  console.log('\n=== יש להם חשבונית ===')
  withInvoice.forEach(w => console.log('✅ ' + w))
  console.log('סה"כ: ' + withInvoice.length)
  
  console.log('\n=== אין להם חשבונית ===')
  withoutInvoice.forEach(w => console.log('❌ ' + w))
  console.log('סה"כ: ' + withoutInvoice.length)
}

main()
