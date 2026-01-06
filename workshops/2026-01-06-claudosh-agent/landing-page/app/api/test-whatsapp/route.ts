import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage, formatPhoneForWhatsApp } from '../../../lib/greenapi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, message } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      )
    }

    const chatId = formatPhoneForWhatsApp(phone)
    const testMessage = message || `🧪 טסט שליחת הודעה

זוהי הודעת בדיקה מדף ההרשמה לסדנה.

אם קיבלת את ההודעה הזו - הכל עובד! ✅`

    const result = await sendWhatsAppMessage({
      chatId,
      message: testMessage
    })

    return NextResponse.json({
      success: result.success,
      chatId,
      messageId: result.messageId,
      error: result.error
    })

  } catch (error) {
    console.error('Test WhatsApp error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
