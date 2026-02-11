'use client'

// Recording link
const RECORDING_LINK = 'https://us06web.zoom.us/rec/share/q46dutNhYJLDYeQW0R6TwzX9BQtLFYlOlkPLYUMiuajoNS1_h0kOSboqf-QETMcH.NLJw2Ko3VMZKEjd1'
const RECORDING_PASSCODE = 'L952Hs+*'
const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=cUzOW5YdUuk'

// NEW: Before Takeoff recording
const BEFORE_TAKEOFF_LINK = 'https://vimeo.com/1159854949?share=copy'
const BEFORE_TAKEOFF_PASSCODE = 'fs$%6ert35wqe'

export default function WatchPage() {
  return (
    <div className="container">
      <div className="thank-you-container">

        {/* NEW RECORDING - TOP PRIORITY */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
          border: '3px solid #F97316',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#F97316', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>
            🔥 חדש!
          </p>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>
            הקלטה מסדנת ״קלודוש רגע לפני השיגור 29.1.26״
          </h2>
          <a
            href={BEFORE_TAKEOFF_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn"
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '18px',
              padding: '14px 28px',
              marginBottom: '12px'
            }}
          >
            🎬 צפייה בהקלטה
          </a>
          <div style={{
            background: 'rgba(249, 115, 22, 0.15)',
            borderRadius: '8px',
            padding: '10px',
            marginTop: '8px'
          }}>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '4px' }}>סיסמה:</p>
            <p style={{ color: '#F97316', fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {BEFORE_TAKEOFF_PASSCODE}
            </p>
          </div>
        </div>

        <h1 className="thank-you-title">קלודוש הסוכן המטורף</h1>
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
            🎬 ההקלטה מוכנה!
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            צפייה נעימה
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <a
            href={RECORDING_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            🎥 צפייה בהקלטה (Zoom)
          </a>

          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '4px' }}>
              סיסמה להקלטה:
            </p>
            <p style={{
              color: '#3B82F6',
              fontSize: '20px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              letterSpacing: '2px'
            }}>
              {RECORDING_PASSCODE}
            </p>
          </div>

          <a
            href={YOUTUBE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn"
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
          >
            ▶️ צפייה ביוטיוב
          </a>
        </div>

        <div className="info-box" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h3>📅 הסדנה התקיימה</h3>
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>
            יום שלישי, 6.1.26
          </p>
        </div>

        {/* Next Workshop Access */}
        <div style={{
          marginTop: '32px',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#22C55E', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px' }}>
            🎁 בונוס למשתתפים!
          </p>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '12px' }}>
            קלודוש - רגע לפני השיגור
          </h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
            כמשתתף בסדנה, יש לך גישה חינם לסדנה הבאה!<br/>
            יום חמישי, 29.1.26 בשעה 21:00
          </p>
          <a
            href="https://us06web.zoom.us/j/83651445103?pwd=yjaRR0fp81jqV1Lta89QvtS5NkBGcV.1"
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '16px',
              padding: '12px 24px'
            }}
          >
            🚀 כניסה לזום
          </a>
          <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '12px' }}>
            סיסמה: 147489
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
