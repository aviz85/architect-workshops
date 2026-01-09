import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load env
dotenv.config({ path: path.join(__dirname, '../../2026-01-06-claudosh-agent/landing-page/.env') })

// ============ WORKSHOP CONFIG ============
const WORKSHOP_NAME = 'claudosh-beginner-2026-01-13'
const WORKSHOP_TITLE = 'קלודוש הסוכן - מתחילים בקטן!'
const WORKSHOP_DATE = 'יום שלישי, 13 בינואר 2026 בשעה 21:00'
const WATCH_PAGE_URL = 'https://claudosh.master-x.co.il/watch-x7m3p'
const ZOOM_LINK = 'https://us06web.zoom.us/j/81637723179?pwd=Rdhjj55bbTnmN9vtP2wDxNIuJp6820.1'
// ==========================================

// Gmail API
const GMAIL_API_URL = 'https://script.google.com/macros/s/AKfycbwLfaOnXYwxfBjZ4ygGPVl8grJ0YpLbYO1kDqE82cNugVaCCDTht4JMbKPP0xCuNZzk/exec'
const GMAIL_TOKEN = '0baed439f142488e45957b21a65c5626'

// Supabase
const supabaseUrl = 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_gSjyKLhNPZfTOiGSHjQYxg_g-pNwaRX'

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0]
}

function getWelcomeEmailHtml(name: string): string {
  const firstName = getFirstName(name)

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ברוך הבא לסדנה!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px;">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
        שלום <strong>${firstName}</strong>,
      </p>

      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        תודה רבה על ההרשמה לסדנה <strong style="color: #22C55E;">${WORKSHOP_TITLE}</strong>!
      </p>

      <div style="background-color: #f0fdf4; border-right: 4px solid #22C55E; padding: 20px; margin: 25px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #166534;">פרטי הסדנה</h3>
        <p style="margin: 5px 0; color: #333;"><strong>תאריך:</strong> ${WORKSHOP_DATE}</p>
        <p style="margin: 5px 0; color: #333;"><strong>משך:</strong> כשעתיים</p>
        <p style="margin: 5px 0; color: #333;"><strong>פלטפורמה:</strong> Zoom (קישור למטה)</p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${WATCH_PAGE_URL}" style="display: inline-block; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 18px; font-weight: bold;">
          כניסה לסדנה
        </a>
      </div>

      <p style="font-size: 14px; color: #666; text-align: center;">
        קישור ישיר לזום (לשמור למקרה הצורך):<br>
        <a href="${ZOOM_LINK}" style="color: #22C55E; word-break: break-all;">${ZOOM_LINK}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="font-size: 14px; color: #888; line-height: 1.6;">
        <strong>טיפ:</strong> כדאי להיכנס כמה דקות לפני תחילת הסדנה לוודא שהכל עובד.<br>
        לאחר השידור, ההקלטה תהיה זמינה באותו קישור.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        נתראה בסדנה!
      </p>
      <p style="margin: 10px 0 0 0; color: #22C55E; font-weight: bold;">
        אביץ - הארכיטקט
      </p>
    </div>

  </div>
</body>
</html>
`
}

async function sendEmail(to: string, name: string): Promise<boolean> {
  const subject = `אישור הרשמה - ${WORKSHOP_TITLE}`
  const html = getWelcomeEmailHtml(name)

  try {
    const params = new URLSearchParams({
      token: GMAIL_TOKEN,
      action: 'send',
      to,
      subject,
      html,
      name: 'AVIZ - הארכיטקט',
    })

    const response = await fetch(`${GMAIL_API_URL}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow',
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error(`Error sending to ${to}:`, error)
    return false
  }
}

async function main() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: participants, error } = await supabase
    .from('workshop_registrations')
    .select('name, email')
    .eq('workshop_name', WORKSHOP_NAME)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching participants:', error)
    return
  }

  console.log(`\n📧 Sending welcome emails to ${participants?.length || 0} participants...\n`)

  for (const p of participants || []) {
    console.log(`  Sending to ${p.name} (${p.email})...`)
    const success = await sendEmail(p.email, p.name)
    console.log(success ? `    ✅ Sent` : `    ❌ Failed`)

    // Small delay between emails
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n✅ Done!\n`)
}

main()
