'use client'

import { useState } from 'react'

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'duplicate entry') {
          setErrorMessage('כבר נרשמת לרשימת ההמתנה')
        } else {
          setErrorMessage('שגיאה בהרשמה, נסו שוב')
        }
        setStatus('error')
        return
      }

      setStatus('success')
    } catch (error) {
      setErrorMessage('שגיאה בהרשמה, נסו שוב')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="container">
        <div className="thank-you-container">
          <h1 className="thank-you-title">נרשמת בהצלחה!</h1>
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '24px'
          }}>
            <p style={{ color: '#22C55E', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
              תודה שנרשמת!
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
              נעדכן אותך כשיהיו סדנאות חדשות
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="thank-you-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <img
          src="/morning-after-workshop.jpg"
          alt="סדנאות עם אביץ"
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}
        />

        <h1 className="thank-you-title">סדנאות עם אביץ - הארכיטקט</h1>

        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px'
        }}>
          <p style={{ color: '#FBBF24', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            אין סדנאות פתוחות כרגע
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
            השאירו פרטים ונעדכן אתכם כשתיפתח הרשמה לסדנה הבאה
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="שם מלא"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                direction: 'rtl'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder="אימייל"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                direction: 'ltr'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <input
              type="tel"
              placeholder="טלפון"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                direction: 'ltr'
              }}
            />
          </div>

          {errorMessage && (
            <p style={{ color: '#EF4444', marginBottom: '16px', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="payment-btn"
            style={{
              width: '100%',
              opacity: status === 'loading' ? 0.7 : 1,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer'
            }}
          >
            {status === 'loading' ? 'שולח...' : 'עדכנו אותי על סדנאות חדשות'}
          </button>
        </form>

        <p className="small-note" style={{ marginTop: '32px' }}>
          שאלות? פנו לאביץ בוואטסאפ:{' '}
          <a
            href="https://wa.me/972503973736"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#22C55E' }}
          >
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
