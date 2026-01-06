import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const { name, phone, email } = body

    // Validate required fields
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Normalize phone
    const normalizedPhone = normalizePhone(phone)

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert waitlist registration
    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert({
        name,
        phone,
        email: email.toLowerCase(),
        workshop_name: 'waitlist',
        marketing_consent: true,
        normalized_phone: normalizedPhone,
        payment_status: 'waitlist',
        is_waitlist: true,
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

    return NextResponse.json({
      success: true,
      message: 'Added to waitlist',
      data: { id: data?.id }
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
