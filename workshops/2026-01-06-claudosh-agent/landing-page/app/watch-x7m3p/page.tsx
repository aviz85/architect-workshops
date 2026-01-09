'use client'

// Zoom link for the workshop
const ZOOM_LINK = 'https://us06web.zoom.us/j/81637723179?pwd=Rdhjj55bbTnmN9vtP2wDxNIuJp6820.1'

export default function WatchPage() {
  return (
    <div className="container">
      <div className="thank-you-container">
        <h1 className="thank-you-title">קלודוש הסוכן - מתחילים בקטן!</h1>
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
            🎬 הסדנה מתחילה!
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            יום שלישי, 13.1.26 בשעה 21:00
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <a
            href={ZOOM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="payment-btn"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '20px'
            }}
          >
            🎥 כניסה לזום
          </a>
        </div>

        <div className="info-box" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h3>📅 פרטי הסדנה</h3>
          <p style={{ color: '#9CA3AF', marginTop: '12px' }}>
            יום שלישי, 13.1.26 | 21:00 | 90 דקות
          </p>
          <p style={{ color: '#9CA3AF', marginTop: '8px', fontSize: '14px' }}>
            למתחילים מוחלטים - אפס רקע טכני נדרש!
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
    </div>
  )
}
