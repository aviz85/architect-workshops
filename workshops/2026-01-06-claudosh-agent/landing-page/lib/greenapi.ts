const GREEN_API_URL = process.env.GREEN_API_URL || 'https://7103.api.greenapi.com'
const GREEN_API_INSTANCE = process.env.GREEN_API_INSTANCE || '7103160388'
const GREEN_API_TOKEN = process.env.GREEN_API_TOKEN || ''

export interface SendMessageParams {
  chatId: string  // Format: 972XXXXXXXXX@c.us
  message: string
}

export async function sendWhatsAppMessage({ chatId, message }: SendMessageParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const url = `${GREEN_API_URL}/waInstance${GREEN_API_INSTANCE}/sendMessage/${GREEN_API_TOKEN}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    })

    const data = await response.json()

    if (response.ok && data.idMessage) {
      return { success: true, messageId: data.idMessage }
    } else {
      return { success: false, error: data.message || 'Failed to send message' }
    }
  } catch (error) {
    console.error('Green API Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Normalize phone number to WhatsApp format
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '')

  // Handle Israeli numbers
  if (digits.startsWith('972')) {
    // Already in correct format
  } else if (digits.startsWith('0')) {
    digits = '972' + digits.substring(1)
  } else if (digits.length === 9) {
    digits = '972' + digits
  }

  return `${digits}@c.us`
}

const BIT_PAYMENT_LINK = 'https://www.bitpay.co.il/app/share-info?i=181782226981_19nKpAMq'

// Send registration confirmation message
export async function sendRegistrationConfirmation(phone: string): Promise<{ success: boolean; error?: string }> {
  const chatId = formatPhoneForWhatsApp(phone)

  const message = `שלום! 👋

תודה רבה על ההרשמה לסדנה *קלודוש הסוכן המטורף*! 🎉

לאחר ביצוע התשלום תקבל/י הודעה עם קישור לסדנה בערב.

💳 לתשלום (50 ש״ח):
${BIT_PAYMENT_LINK}

🕘 הסדנה ביום שלישי 6.1.26 בשעה 21:00

נתראה! 🚀
אביץ - הארכיטקט`

  return sendWhatsAppMessage({ chatId, message })
}

// Send watch page link after payment verification
export async function sendZoomLink(phone: string, watchPageUrl: string): Promise<{ success: boolean; error?: string }> {
  const chatId = formatPhoneForWhatsApp(phone)

  const message = `מעולה! התשלום התקבל ✅

הנה הקישור לסדנה *קלודוש הסוכן המטורף*:

🔗 ${watchPageUrl}

🕘 יום שלישי 6.1.26 בשעה 21:00
⏰ כדאי להיכנס כמה דקות לפני

נתראה! 🚀
אביץ - הארכיטקט`

  return sendWhatsAppMessage({ chatId, message })
}
