'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const WORKSHOP_NAME = 'claude-code-amaleh-2026-01-01'

// Phone validation and normalization
function normalizePhone(phone: string): string {
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '')

  // Handle Israeli numbers
  if (digits.startsWith('972')) {
    digits = digits.substring(3)
  } else if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }

  // Add 972 prefix
  return '972' + digits
}

function validatePhone(phone: string): boolean {
  const normalized = normalizePhone(phone)
  // Israeli mobile numbers: 972 + 5X + 7 digits = 12 digits total
  return /^972[5][0-9]{8}$/.test(normalized)
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LandingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    marketingConsent: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'נא להזין שם'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'נא להזין מספר טלפון'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'מספר טלפון לא תקין (נייד ישראלי)'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'נא להזין כתובת אימייל'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          marketingConsent: formData.marketingConsent,
          workshopName: WORKSHOP_NAME,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/thank-you')
      } else {
        if (data.error?.includes('duplicate') || data.error?.includes('unique')) {
          setErrors({ email: 'כבר נרשמת לסדנה עם פרטים אלו' })
        } else {
          setErrors({ submit: data.error || 'שגיאה בהרשמה, נסה שוב' })
        }
      }
    } catch (error) {
      setErrors({ submit: 'שגיאה בהרשמה, נסה שוב' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <img
        src="/poster.jpg"
        alt="קלוד קוד אמאל׳ה - סדנה"
        className="poster"
      />

      <div className="form-container">
        <h2 className="form-title">הרשמה לסדנה</h2>
        <p className="form-subtitle">מלאו את הפרטים והמשיכו לתשלום</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">שם מלא</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="הזינו שם מלא"
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">מספר טלפון</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="050-1234567"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              dir="ltr"
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">אימייל</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              dir="ltr"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="marketingConsent"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleChange}
              className="checkbox-input"
            />
            <label htmlFor="marketingConsent" className="checkbox-label">
              אני מאשר/ת לקבל עדכונים וחומר שיווקי במייל/וואטסאפ
            </label>
          </div>

          {errors.submit && (
            <p className="error-message" style={{ textAlign: 'center', marginBottom: '16px' }}>
              {errors.submit}
            </p>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'שולח...' : 'המשך לתשלום ←'}
          </button>
        </form>

        <div className="note">
          <strong>שימו לב:</strong>
          <br />• אם רוצים שם מסוים בחשבונית - נא לכתוב אותו בשדה השם
          <br />• ודאו שמספר הטלפון זהה למספר שהצטרפתם איתו לקבוצת הוואטסאפ
          <br />• חשבונית מס/קבלה תישלח בימים הקרובים
        </div>

        <p className="contact-info">
          בכל בעיה ניתן לפנות לאביץ בפרטי בוואטסאפ: {' '}
          <a href="https://wa.me/972503973736" target="_blank" rel="noopener noreferrer">
            050-3973736
          </a>
        </p>

        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '16px' }}>
          <a
            href="https://architect.master-x.co.il/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#6B7280', textDecoration: 'underline' }}
          >
            מדיניות פרטיות
          </a>
        </p>
      </div>
    </div>
  )
}
