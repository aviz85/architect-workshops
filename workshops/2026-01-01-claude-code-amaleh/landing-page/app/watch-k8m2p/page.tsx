'use client'

// Zoom link for Tuesday workshop
const ZOOM_LINK = 'https://us06web.zoom.us/j/85374512520?pwd=SeNeeFB4Uznkjq0zImONKbSGkri7iD.1'

export default function WatchPage() {
  return (
    <div className="container">
      <div className="thank-you-container">
        <h1 className="thank-you-title">קלוד קוד אמאל׳ה</h1>
        <p className="thank-you-text">
          סדנה עם אביץ - הארכיטקט
        </p>

        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <p style={{ color: '#FBBF24', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            🎁 בונוס! סדנת המשך ביום שלישי 6.1.26
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            כמשתתפי סדנת אמאל׳ה - מוזמנים להצטרף לסדנת ההמשך בחינם!
            <br />
            הסדנה תהיה מסודרת וחדה יותר בתוכן.
          </p>
        </div>

        <a
          href={ZOOM_LINK}
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
          🎥 כניסה לזום - יום שלישי 21:00
        </a>

        <div className="info-box" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h3>📅 פרטים</h3>
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>
            יום שלישי, 6.1.26 בשעה 21:00
            <br />
            ההקלטה תהיה זמינה אחרי הסדנה
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
