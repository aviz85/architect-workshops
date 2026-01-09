import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppMessage, formatPhoneForWhatsApp } from '../../../lib/greenapi'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Simple API key for webhook security
const WEBHOOK_API_KEY = process.env.MORNING_WEBHOOK_KEY || 'mw_aviz_2026_secret'

// Gmail API (no emojis - URL encoding breaks them)
const GMAIL_API_URL = 'https://script.google.com/macros/s/AKfycbwLfaOnXYwxfBjZ4ygGPVl8grJ0YpLbYO1kDqE82cNugVaCCDTht4JMbKPP0xCuNZzk/exec'
const GMAIL_TOKEN = '0baed439f142488e45957b21a65c5626'

// Workshop configurations
const WORKSHOPS: Record<string, {
  dbName: string
  title: string
  date: string
  watchPageUrl: string
  zoomLink: string
}> = {
  'מתחילים בקטן': {
    dbName: 'claudosh-beginner-2026-01-13',
    title: 'קלודוש הסוכן - מתחילים בקטן!',
    date: 'יום שלישי 13.1.26 בשעה 21:00',
    watchPageUrl: 'https://claudosh.master-x.co.il/watch-x7m3p',
    zoomLink: 'https://us06web.zoom.us/j/81637723179?pwd=Rdhjj55bbTnmN9vtP2wDxNIuJp6820.1',
  },
  'קלודוש הסוכן המטורף': {
    dbName: 'claudosh-agent-2026-01-06',
    title: 'קלודוש הסוכן המטורף',
    date: 'יום שלישי 6.1.26 בשעה 21:00',
    watchPageUrl: 'https://claudosh.master-x.co.il/watch-q3x7z',
    zoomLink: 'https://us06web.zoom.us/j/85374512520?pwd=SeNeeFB4Uznkjq0zImONKbSGkri7iD.1',
  },
}

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }
  return '972' + digits
}

function getFirstName(fullName: string): string {
  return fullName.split(' ')[0]
}

function getWelcomeMessage(name: string, workshop: typeof WORKSHOPS[string]): string {
  return `היי ${getFirstName(name)}! 👋

תודה רבה על ההרשמה לסדנה *${workshop.title}* 🎉

ברוך הבא! הסדנה תתקיים ב${workshop.date}.

🔗 הלינק לכניסה לסדנה:
${workshop.watchPageUrl}

נתראה! 💪
אביץ`
}

function getFollowUpMessage(workshop: typeof WORKSHOPS[string]): string {
  return `אגב, אם יש בעיה להיכנס לקישור - הנה קישור ישיר לזום:
${workshop.zoomLink}

בקישור למעלה תופיע גם ההקלטה לאחר השידור`
}

// Email HTML template (no emojis!)
function getWelcomeEmailHtml(name: string, workshop: typeof WORKSHOPS[string]): string {
  const firstName = getFirstName(name)
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ברוך הבא לסדנה!</h1>
    </div>
    <div style="padding: 30px;">
      <p style="font-size: 18px; color: #333; margin-bottom: 20px;">שלום <strong>${firstName}</strong>,</p>
      <p style="font-size: 16px; color: #555; line-height: 1.6;">תודה רבה על ההרשמה לסדנה <strong style="color: #22C55E;">${workshop.title}</strong>!</p>
      <div style="background-color: #f0fdf4; border-right: 4px solid #22C55E; padding: 20px; margin: 25px 0; border-radius: 8px;">
        <h3 style="margin: 0 0 15px 0; color: #166534;">פרטי הסדנה</h3>
        <p style="margin: 5px 0; color: #333;"><strong>תאריך:</strong> ${workshop.date}</p>
        <p style="margin: 5px 0; color: #333;"><strong>משך:</strong> כשעתיים</p>
        <p style="margin: 5px 0; color: #333;"><strong>פלטפורמה:</strong> Zoom</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${workshop.watchPageUrl}" style="display: inline-block; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 18px; font-weight: bold;">כניסה לסדנה</a>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">קישור ישיר לזום:<br><a href="${workshop.zoomLink}" style="color: #22C55E;">${workshop.zoomLink}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 14px; color: #888; line-height: 1.6;"><strong>טיפ:</strong> כדאי להיכנס כמה דקות לפני תחילת הסדנה.<br>לאחר השידור, ההקלטה תהיה זמינה באותו קישור.</p>
    </div>
    <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="margin: 0; color: #666; font-size: 14px;">נתראה בסדנה!</p>
      <p style="margin: 10px 0 0 0; color: #22C55E; font-weight: bold;">אביץ - הארכיטקט</p>
    </div>
  </div>
</body>
</html>`
}

async function sendWelcomeEmail(email: string, name: string, workshop: typeof WORKSHOPS[string]): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      token: GMAIL_TOKEN,
      action: 'send',
      to: email,
      subject: `אישור הרשמה - ${workshop.title}`,
      html: getWelcomeEmailHtml(name, workshop),
      name: 'AVIZ - הארכיטקט',
    })
    const response = await fetch(`${GMAIL_API_URL}?${params.toString()}`, { redirect: 'follow' })
    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== WEBHOOK_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, workshopKeyword } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, phone' },
        { status: 400 }
      )
    }

    // Find workshop by keyword
    let workshop = WORKSHOPS['מתחילים בקטן'] // Default
    if (workshopKeyword) {
      for (const [key, value] of Object.entries(WORKSHOPS)) {
        if (workshopKeyword.includes(key)) {
          workshop = value
          break
        }
      }
    }

    const normalizedPhone = normalizePhone(phone)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if already exists
    const { data: existing } = await supabase
      .from('workshop_registrations')
      .select('id, payment_status')
      .eq('normalized_phone', normalizedPhone)
      .eq('workshop_name', workshop.dbName)
      .single()

    let dbAction = 'none'

    if (existing) {
      // Update to paid if not already
      if (existing.payment_status !== 'paid') {
        await supabase
          .from('workshop_registrations')
          .update({ payment_status: 'paid', notes: 'Updated via Morning webhook' })
          .eq('id', existing.id)
        dbAction = 'updated'
      } else {
        dbAction = 'already_paid'
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('workshop_registrations')
        .insert({
          name,
          email: email.toLowerCase(),
          phone,
          normalized_phone: normalizedPhone,
          workshop_name: workshop.dbName,
          payment_status: 'paid',
          marketing_consent: false,
          is_waitlist: false,
          notes: 'Added via Morning webhook',
        })

      if (error) {
        console.error('Supabase error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      dbAction = 'inserted'
    }

    // Send WhatsApp messages
    const chatId = formatPhoneForWhatsApp(phone)

    const welcomeResult = await sendWhatsAppMessage({
      chatId,
      message: getWelcomeMessage(name, workshop),
    })

    // Small delay between messages
    await new Promise(r => setTimeout(r, 1000))

    const followUpResult = await sendWhatsAppMessage({
      chatId,
      message: getFollowUpMessage(workshop),
    })

    // Send welcome email
    const emailResult = await sendWelcomeEmail(email, name, workshop)

    return NextResponse.json({
      success: true,
      participant: { name, email, phone: normalizedPhone },
      workshop: workshop.title,
      dbAction,
      whatsapp: {
        welcome: welcomeResult.success,
        followUp: followUpResult.success,
      },
      email: emailResult,
    })

  } catch (error) {
    console.error('Morning webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'morning-webhook' })
}
