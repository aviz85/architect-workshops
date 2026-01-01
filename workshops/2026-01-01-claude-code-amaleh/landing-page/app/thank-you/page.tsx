'use client'

const BIT_PAYMENT_LINK = 'https://www.bitpay.co.il/app/share-info?i=181782226981_19nKC00P'

// Generate QR code URL using QR Server API
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(BIT_PAYMENT_LINK)}`

export default function ThankYouPage() {
  return (
    <div className="container">
      <div className="thank-you-container">
        <div className="success-icon">✅</div>
        <h1 className="thank-you-title">תודה על ההרשמה!</h1>
        <p className="thank-you-text">
          נרשמת בהצלחה לסדנה
          <br />
          <strong>קלוד קוד אמאל׳ה</strong>
        </p>

        <a
          href={BIT_PAYMENT_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="payment-btn"
        >
          💳 לתשלום בביט - 50 ש״ח
        </a>

        {/* QR Code for desktop users only */}
        <div className="qr-desktop-only" style={{
          marginTop: '24px',
          padding: '20px',
          background: 'white',
          borderRadius: '16px',
          display: 'inline-block'
        }}>
          <img
            src={QR_CODE_URL}
            alt="QR Code לתשלום בביט"
            width={200}
            height={200}
            style={{ display: 'block' }}
          />
          <p style={{
            fontSize: '13px',
            color: '#666',
            marginTop: '12px',
            marginBottom: '0'
          }}>
            📱 סרקו עם הטלפון לתשלום בביט
          </p>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .qr-desktop-only {
              display: none !important;
            }
          }
        `}</style>

        <div className="info-box">
          <h3>מה עכשיו?</h3>
          <ul>
            <li>לחצו על הכפתור למעלה או סרקו את הQR לתשלום בביט</li>
            <li>אני מאמת את התשלום מול המספר שהצטרפתם איתו לקבוצה</li>
            <li>תקבלו הודעה בפרטי עם קישור לשידור החי</li>
          </ul>
        </div>

        <div className="info-box" style={{ background: 'rgba(251, 191, 36, 0.1)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
          <h3 style={{ color: '#FBBF24' }}>⏰ הסדנה היום בשעה 21:00!</h3>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '8px' }}>
            הקישור לזום יישלח אליכם בוואטסאפ לאחר אימות התשלום
          </p>
        </div>

        <p className="small-note">
          הקישור אמור להגיע תוך רבע שעה מרגע התשלום.
          <br />
          אם לא קיבלתם הודעה - נא לפנות בפרטי לאביץ בוואטסאפ:
          <br />
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
