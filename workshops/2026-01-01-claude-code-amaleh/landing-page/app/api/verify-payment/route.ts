import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendZoomLink } from '../../../lib/greenapi'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrhdriqwteyeelvxipet.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const geminiApiKey = process.env.GEMINI_API_KEY || ''

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'
const WATCH_PAGE_URL = process.env.NEXT_PUBLIC_WATCH_PAGE_URL || ''

// Normalize phone number to match database format
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }

  // Return in 972XXXXXXXXX format
  if (digits.length === 9) {
    return '972' + digits
  }

  return digits.length >= 9 ? '972' + digits.slice(-9) : digits
}

// Extract phone numbers from image using Gemini
async function extractPhoneNumbersFromImage(imageBase64: string): Promise<string[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            text: `Extract all Israeli phone numbers from this image.
Israeli phone numbers typically:
- Start with 05X (mobile) or have format 972-5X-XXX-XXXX
- Have 10 digits when starting with 0, or 12 digits when starting with 972

Return ONLY a JSON array of phone numbers found, nothing else.
Example output: ["0501234567", "0521234567"]
If no phone numbers found, return: []`
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      }
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', errorText)
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()

  try {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]'
    // Extract JSON array from response
    const match = text.match(/\[[\s\S]*\]/)
    if (match) {
      return JSON.parse(match[0])
    }
    return []
  } catch (e) {
    console.error('Failed to parse Gemini response:', e)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File | null

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64
    const arrayBuffer = await image.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    // Extract phone numbers using Gemini
    const phoneNumbers = await extractPhoneNumbersFromImage(base64)

    if (phoneNumbers.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No phone numbers found in image',
        processed: 0
      })
    }

    // Normalize all phone numbers
    const normalizedPhones = phoneNumbers.map(normalizePhone)

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update payment status and send Zoom links
    const results = []

    for (const phone of normalizedPhones) {
      // Find registration with this phone
      const { data: registration, error: findError } = await supabase
        .from('workshop_registrations')
        .select('*')
        .eq('normalized_phone', phone)
        .eq('workshop_name', WORKSHOP_NAME)
        .eq('payment_status', 'pending')
        .single()

      if (findError || !registration) {
        results.push({
          phone,
          status: 'not_found',
          message: 'No pending registration found'
        })
        continue
      }

      // Update payment status to 'bit'
      const { error: updateError } = await supabase
        .from('workshop_registrations')
        .update({ payment_status: 'bit' })
        .eq('id', registration.id)

      if (updateError) {
        results.push({
          phone,
          status: 'error',
          message: 'Failed to update payment status'
        })
        continue
      }

      // Send watch page link via WhatsApp
      const whatsappResult = await sendZoomLink(phone, WATCH_PAGE_URL)

      results.push({
        phone,
        name: registration.name,
        status: 'success',
        paymentUpdated: true,
        whatsappSent: whatsappResult.success
      })
    }

    return NextResponse.json({
      success: true,
      phoneNumbers: normalizedPhones,
      processed: results.filter(r => r.status === 'success').length,
      results
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
