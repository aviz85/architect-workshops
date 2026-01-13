'use client'

// Recording link
const RECORDING_LINK = 'https://us06web.zoom.us/rec/share/q46dutNhYJLDYeQW0R6TwzX9BQtLFYlOlkPLYUMiuajoNS1_h0kOSboqf-QETMcH.NLJw2Ko3VMZKEjd1'
const RECORDING_PASSCODE = 'L952Hs+*'
const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=cUzOW5YdUuk'

export default function WatchPage() {
  return (
    <div className="container">
      <div className="thank-you-container">
        <h1 className="thank-you-title">קלודוש הסוכן המטורף</h1>
        <p className="thank-you-text">
          סדנה עם אביץ - הארכיטקט
        </p>

        {/* TODAY'S Workshop - Top Priority */}
        <div style={{
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(16, 185, 129, 0.15) 100%)',
          border: '3px solid #22C55E',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)'
        }}>
          <p style={{ color: '#22C55E', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '2px' }}>
            🔥 סדנה היום!! 🔥
          </p>
          <h3 style={{ color: '#fff', fontSize: '22px', marginBottom: '12px' }}>
            קלודוש הסוכן - מתחילים בקטן!
          </h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
            כמשתתף בסדנה, יש לך גישה גם לסדנה הזו!<br/>
            <strong style={{ color: '#22C55E' }}>היום! יום שלישי, 13.1.26 בשעה 21:00</strong>
          </p>
          <a
            href="https://claudosh.master-x.co.il/watch-x7m3p"
            className="payment-btn"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '18px',
              padding: '14px 28px',
              fontWeight: 'bold'
            }}
          >
            🚀 לעמוד הסדנה
          </a>
        </div>

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
