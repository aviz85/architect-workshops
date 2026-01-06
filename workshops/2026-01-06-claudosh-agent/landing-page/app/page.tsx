export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    }}>
      <a
        href="https://www.bitpay.co.il/app/share-info?i=181782226981_19nKpAMq"
        target="_blank"
        rel="noopener noreferrer"
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <img
          src="/poster-v5.jpg"
          alt="קלודוש הסוכן המטורף - סדנה"
          style={{
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
        />
      </a>
      <a
        href="https://www.bitpay.co.il/app/share-info?i=181782226981_19nKpAMq"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: '24px',
          padding: '16px 48px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'white',
          background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)'
        }}
      >
        להרשמה ותשלום
      </a>
    </div>
  )
}
