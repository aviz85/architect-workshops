'use client'

// Payment link
const PAYMENT_LINK = 'https://mrng.to/IeWJ4iAaBO'
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(PAYMENT_LINK)}&bgcolor=1F2937&color=22C55E`

export default function WatchBeginner() {
  return (
    <div className="container">
      <div className="thank-you-container">
        {/* Poster */}
        <img
          src="/poster-beginner.jpg"
          alt="קלודוש הסוכן - מתחילים בקטן!"
          style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3)'
          }}
        />

        <h1 className="thank-you-title">קלודוש הסוכן</h1>
        <p style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#22C55E',
          marginBottom: '8px'
        }}>
          מתחילים בקטן!
        </p>
        <p className="thank-you-text">
          סדנה עם אביץ - הארכיטקט
        </p>

        {/* Background/Intro Text */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'right',
          lineHeight: '1.8'
        }}>
          <p style={{ color: '#E5E7EB', fontSize: '16px' }}>
            בטח שמעתם על <strong style={{ color: '#22C55E' }}>סוכני בינה מלאכותית</strong> שיכולים לעבוד בשבילכם, אבל עד כמה זה באמת רציני?
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '15px', marginTop: '12px' }}>
            דווקא התפתחויות מרגשות שקורות בימים אלה מראות לנו שהסוכנים זה לא פיקציה אלא <strong style={{ color: '#22C55E' }}>פרקטיקה של ממש</strong>.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '15px', marginTop: '12px' }}>
            איך לשלב את השפיץ של הטכנולוגיה בעבודה היומיומית שלנו על המחשב ולהביא ל<strong style={{ color: '#22C55E' }}>התייעלות משמעותית באמת</strong>?
          </p>
        </div>

        {/* Workshop Info */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#22C55E', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            יום שלישי, 13.1.26 בשעה 21:00
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
            בזום | 90 דקות | למתחילים מוחלטים
          </p>
        </div>

        {/* What you'll learn */}
        <div className="info-box" style={{ marginBottom: '24px', textAlign: 'right' }}>
          <h3>מה תלמדו?</h3>
          <ul>
            <li>התקנה והכרות עם אפליקציית הדסקטופ</li>
            <li>דוגמאות פשוטות וקלות ליישום</li>
            <li>הצצה לטרמינל - שם הכוח האמיתי</li>
            <li>אפס רקע טכני נדרש!</li>
          </ul>
        </div>

        {/* Payment Button */}
        <a
          href={PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="payment-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '400px',
            fontSize: '22px'
          }}
        >
          💳 לתשלום והרשמה
        </a>

        {/* QR Code for Desktop */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '16px' }}>
            במחשב? סרקו את הקוד לתשלום בנייד:
          </p>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            <img
              src={QR_CODE_URL}
              alt="QR Code לתשלום"
              style={{
                width: '180px',
                height: '180px',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* Contact */}
        <p className="small-note" style={{ marginTop: '24px' }}>
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
