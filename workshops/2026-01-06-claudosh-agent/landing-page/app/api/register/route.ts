import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendRegistrationConfirmation, sendWhatsAppMessage, formatPhoneForWhatsApp } from '../../../lib/greenapi'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Normalize phone number
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }

  return '972' + digits
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, marketingConsent, workshopName, question } = body

    // Validate required fields
    if (!name || !phone || !email || !workshopName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Normalize phone
    const normalizedPhone = normalizePhone(phone)

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert registration
    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert({
        name,
        phone,
        email: email.toLowerCase(),
        workshop_name: workshopName,
        marketing_consent: marketingConsent || false,
        normalized_phone: normalizedPhone,
        payment_status: 'pending',
        is_waitlist: false,
        notes: question || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)

      // Handle duplicate entry
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'duplicate entry' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Send WhatsApp confirmation (don't wait for it to complete)
    sendRegistrationConfirmation(normalizedPhone)
      .then(result => {
        if (!result.success) {
          console.error('WhatsApp send failed:', result.error)
        } else {
          console.log('WhatsApp sent successfully')
        }
      })
      .catch(err => {
        console.error('WhatsApp send error:', err)
      })

    // If user has a question, forward it to Aviz via WhatsApp
    if (question && question.trim()) {
      const avizChatId = '972503973736@c.us'
      const questionMsg = `📩 שאלה חדשה מהרשמה לסדנה (${workshopName})\n\n👤 ${name}\n📱 ${phone}\n📧 ${email}\n\n❓ שאלה:\n${question}`
      sendWhatsAppMessage({ chatId: avizChatId, message: questionMsg })
        .catch(err => console.error('Question forward error:', err))
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: { id: data?.id }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
