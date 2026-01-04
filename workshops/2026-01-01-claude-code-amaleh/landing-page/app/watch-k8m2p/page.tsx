'use client'

import { useState } from 'react'

// Recording link (workshop completed)
const RECORDING_LINK = 'https://us06web.zoom.us/rec/share/gqBpanKx9C7-sgutUBwP43y-4BWaCU4VTmLHlW6dDUzMNoM_NZz5iztfbGTnQGDj.y9OY36K68T0EqdLg'
const RECORDING_PASSCODE = '=N4^.N?p'

export default function WatchPage() {
  const [copied, setCopied] = useState(false)

  const copyPasscode = () => {
    navigator.clipboard.writeText(RECORDING_PASSCODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container">
      <div className="thank-you-container">
        <h1 className="thank-you-title">קלוד קוד אמאל׳ה</h1>
        <p className="thank-you-text">
          סדנה עם אביץ - הארכיטקט
        </p>

        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#22C55E', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            🎬 ההקלטה זמינה!
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            הסדנה התקיימה ב-1.1.26 - צפו בהקלטה המלאה
          </p>
        </div>

        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#FBBF24', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
            🔑 על מנת לצפות בסרטון יש להכניס את הסיסמא:
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <code style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              color: '#FBBF24',
              fontSize: '18px',
              fontFamily: 'monospace'
            }}>
              {RECORDING_PASSCODE}
            </code>
            <button
              onClick={copyPasscode}
              style={{
                background: copied ? '#22C55E' : 'rgba(107, 114, 128, 0.3)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s'
              }}
            >
              {copied ? '✓ הועתק!' : '📋 העתק'}
            </button>
          </div>
        </div>

        <a
          href={RECORDING_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="payment-btn"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          🎥 צפה בהקלטה
        </a>

        <div className="info-box" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h3>📅 פרטי הסדנה</h3>
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>
            התקיימה ביום חמישי, 1.1.26
            <br />
            משך: כשעה וחצי
          </p>
        </div>

        <p className="small-note" style={{ marginTop: '24px' }}>
          בעיות טכניות? פנו לאביץ בוואטסאפ:{' '}
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

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
