'use client'

import { useState, useRef } from 'react'

export default function SeriesPage() {
  const paymentLink = 'https://mrng.to/T8sXLy6nZi'
  const formRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', question: '' })
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          question: formData.question,
          marketingConsent,
          workshopName: 'spaceship-series-1',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error === 'duplicate entry') {
          // Already registered — just redirect to payment
          window.open(paymentLink, '_blank')
          setStatus('idle')
          return
        }
        setErrorMessage('שגיאה בהרשמה, נסו שוב')
        setStatus('error')
        return
      }

      setStatus('success')
      // Redirect to Morning payment page
      window.open(paymentLink, '_blank')
    } catch {
      setErrorMessage('שגיאה בהרשמה, נסו שוב')
      setStatus('error')
    }
  }

  const sessions = [
    {
      num: 1,
      emoji: '🚀',
      title: 'השיגור',
      tagline: 'מ-0 לסוכן עובד בשעתיים',
      poster: '/series/poster-v4-1-launch.jpg',
      monDate: 'שני 16.2 ב-21:00',
      thuDate: 'חמישי 19.2 ב-9:30',
      bullets: [
        'מתקינים Claude Code ומגדירים את הסוכן',
        'כותבים CLAUDE.md — הזיכרון של הסוכן',
        'מתקינים סקיל ראשון שעובד מהרגע הראשון',
        'דמו חי: WhatsApp, PDF, פוסטר — הכל מהסוכן',
      ],
      fish: 'סוכן מותקן + סקיל עובד + CLAUDE.md שמכיר את העסק שלך',
    },
    {
      num: 2,
      emoji: '🛸',
      title: 'מצב חללית',
      tagline: 'בונים פרויקטים אמיתיים מ-א׳ עד ת׳',
      poster: '/series/poster-v4-2-spaceship.jpg',
      monDate: 'שני 23.2 ב-21:00',
      thuDate: 'חמישי 26.2 ב-9:30',
      bullets: [
        'בונים CRM אישי — ניהול לקוחות מהסוכן',
        'בונים מנוע תוכן — פוסטים, מיילים, בסגנון שלך',
        'חיבור בין פרויקטים — הקסם האמיתי',
        'חצי-אוטומאט: שולח משימה, הולך לקפה, חוזר לתוצאות',
      ],
      fish: '2 פרויקטים עובדים + חיבור cross-project + תהליך עבודה של מנהל',
    },
    {
      num: 3,
      emoji: '🌌',
      title: 'אפס כבידה',
      tagline: 'הסוכנים עובדים, אתה מנהל',
      poster: '/series/poster-v4-3-zerog.jpg',
      monDate: 'שני 2.3 ב-21:00',
      thuDate: 'חמישי 5.3 ב-9:30',
      bullets: [
        'צוותי סוכנים — 3 סוכנים עובדים על משימה אחת',
        'תזמורת ווצאפ — שולח הודעה קולית, מקבל תוצאות',
        'סוכן 24/7 — עובד בזמן שאתה ישן',
        'מתכננים את מערכת ההפעלה האישית שלך',
      ],
      fish: 'חוויית צוות סוכנים + שליטה מהנייד + ארכיטקטורת מערכת שלמה',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Hero */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '0 0 60px',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '600px',
          background: 'radial-gradient(ellipse at center top, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', textAlign: 'center', position: 'relative' }}>
          <p style={{ color: '#22C55E', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
            AVIZ — THE ARCHITECT
          </p>
          <h1 style={{
            fontSize: 'clamp(36px, 7vw, 56px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            marginBottom: 16,
          }}>
            החללית של קלודוש
          </h1>
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#9CA3AF',
            maxWidth: 500,
            margin: '0 auto 32px',
            lineHeight: 1.5,
          }}>
            3 מפגשים תמציתיים שהופכים אותך ממשתמש AI למנהל סוכנים
          </p>
          <img
            src="/series/poster-v3-series-combined.jpg"
            alt="החללית של קלודוש — 3 מפגשים"
            style={{
              width: '100%',
              maxWidth: 700,
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(34, 197, 94, 0.2)',
              marginBottom: 32,
            }}
          />
          <button
            onClick={scrollToForm}
            style={{
              display: 'inline-block',
              padding: '18px 48px',
              fontSize: 22,
              fontWeight: 700,
              color: '#0a0a0a',
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
            }}
          >
            הרשמה לסדרה — ₪297
          </button>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 12 }}>
            3 מפגשים × שעתיים | מתחילים 16.2
          </p>
        </div>
      </section>

      {/* The Story */}
      <section style={{
        padding: '60px 20px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111827 100%)',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 24 }}>
            אתה לא לומד כלי. אתה בונה עובד.
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 500,
            margin: '0 auto',
          }}>
            {[
              { emoji: '🚀', text: 'מפגש 1: אתה מגייס את העובד' },
              { emoji: '🛸', text: 'מפגש 2: אתה מכשיר את העובד' },
              { emoji: '🌌', text: 'מפגש 3: העובד מנהל את העסק — אתה שותה קפה' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                background: 'rgba(34, 197, 94, 0.08)',
                borderRadius: 12,
                border: '1px solid rgba(34, 197, 94, 0.15)',
                textAlign: 'right',
              }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</span>
                <span style={{ fontSize: 18, color: '#E5E7EB', fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <p style={{
            color: '#9CA3AF',
            fontSize: 16,
            marginTop: 32,
            lineHeight: 1.7,
            maxWidth: 550,
            margin: '32px auto 0',
          }}>
            לא צריך לדעת לתכנת. לא צריך ניסיון קודם.
            <br />
            רק מחשב, אינטרנט, ורצון לבנות משהו אמיתי.
          </p>
        </div>
      </section>

      {/* Sessions */}
      <section style={{
        padding: '60px 20px',
        background: '#111827',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 48 }}>
            מה קורה בכל מפגש
          </h2>
          {sessions.map((session, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              gap: 32,
              marginBottom: 56,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}>
              <div style={{ flex: '1 1 280px', minWidth: 280 }}>
                <img
                  src={session.poster}
                  alt={session.title}
                  style={{
                    width: '100%',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                />
              </div>
              <div style={{ flex: '1 1 320px', minWidth: 280, textAlign: 'right' }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22C55E',
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  מפגש {session.num}
                </div>
                <h3 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {session.emoji} {session.title}
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 16 }}>
                  {session.tagline}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
                  {session.bullets.map((bullet, j) => (
                    <li key={j} style={{
                      color: '#D1D5DB',
                      fontSize: 15,
                      marginBottom: 8,
                      paddingRight: 20,
                      position: 'relative',
                      lineHeight: 1.5,
                    }}>
                      <span style={{ position: 'absolute', right: 0, color: '#22C55E' }}>✓</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(34, 197, 94, 0.08)',
                  borderRadius: 8,
                  borderRight: '3px solid #22C55E',
                }}>
                  <p style={{ color: '#22C55E', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>יוצאים עם:</p>
                  <p style={{ color: '#D1D5DB', fontSize: 14 }}>{session.fish}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section style={{
        padding: '60px 20px',
        background: '#0a0a0a',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            לוח זמנים — מחזור 1
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 16, marginBottom: 32 }}>
            כל שבוע אותו שיעור ב-2 מועדים. בחר מה שנוח לך.
          </p>
          <div style={{
            background: '#1F2937',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid #374151',
          }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              background: 'rgba(34, 197, 94, 0.1)',
              padding: '14px 20px',
              borderBottom: '1px solid #374151',
            }}>
              <span style={{ color: '#22C55E', fontWeight: 700, fontSize: 14, textAlign: 'right' }}>שיעור</span>
              <span style={{ color: '#22C55E', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>שני בערב</span>
              <span style={{ color: '#22C55E', fontWeight: 700, fontSize: 14, textAlign: 'center' }}>חמישי בבוקר</span>
            </div>
            {sessions.map((session, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '16px 20px',
                borderBottom: i < 2 ? '1px solid #374151' : 'none',
                alignItems: 'center',
              }}>
                <span style={{ color: '#E5E7EB', fontWeight: 600, fontSize: 15, textAlign: 'right' }}>
                  {session.emoji} {session.title}
                </span>
                <span style={{ color: '#D1D5DB', fontSize: 14, textAlign: 'center' }}>{session.monDate}</span>
                <span style={{ color: '#D1D5DB', fontSize: 14, textAlign: 'center' }}>{session.thuDate}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 12 }}>
            פיספסת יום שני? יש חמישי בבוקר. אותו תוכן, שעות שונות.
          </p>
        </div>
      </section>

      {/* What You Need */}
      <section style={{
        padding: '60px 20px',
        background: '#111827',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 32 }}>
            מה צריך להגיע?
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {[
              { icon: '💻', text: 'מחשב (Mac/Windows/Linux)' },
              { icon: '🌐', text: 'חיבור אינטרנט' },
              { icon: '🤖', text: 'מנוי Claude פעיל' },
              { icon: '💡', text: 'רצון לבנות משהו אמיתי' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '16px 24px',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                border: '1px solid #374151',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                minWidth: 220,
              }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <span style={{ color: '#D1D5DB', fontSize: 15 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 20 }}>
            לא צריך ניסיון בתכנות. בכלל.
          </p>
        </div>
      </section>

      {/* Price CTA */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #111827 0%, #0a0a0a 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <p style={{ color: '#22C55E', fontSize: 14, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>
            מוכנים להמריא?
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            ₪297
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: 18, marginBottom: 32 }}>
            3 מפגשים × שעתיים | 6 שעות של בנייה אמיתית
          </p>
          <div style={{
            background: '#1F2937',
            borderRadius: 16,
            padding: '24px',
            marginBottom: 32,
            border: '1px solid #374151',
            textAlign: 'right',
          }}>
            <p style={{ color: '#22C55E', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>מה כלול:</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                '3 מפגשי לייב בזום עם בנייה בזמן אמת',
                '2 מועדים כל שבוע — גמישות מלאה',
                'גישה להקלטות כל המפגשים',
                'קבוצת WhatsApp לתמיכה שוטפת',
                'ערכת כלים מוכנה (סקילים, תבניות, אינטגרציות)',
                'תמיכה אישית מאביץ',
              ].map((item, i) => (
                <li key={i} style={{
                  color: '#D1D5DB',
                  fontSize: 15,
                  marginBottom: 10,
                  paddingRight: 24,
                  position: 'relative',
                }}>
                  <span style={{ position: 'absolute', right: 0, color: '#22C55E' }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Registration Form */}
          <div ref={formRef} style={{
            background: '#1F2937',
            borderRadius: 16,
            padding: '32px 24px',
            border: '1px solid #374151',
            textAlign: 'right',
          }}>
            <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
              השאירו פרטים והמשיכו לתשלום
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
              לאחר מילוי הפרטים תועברו לדף תשלום מאובטח
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                type="text"
                placeholder="שם מלא"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  direction: 'rtl',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="tel"
                placeholder="טלפון"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  direction: 'ltr',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="email"
                placeholder="אימייל"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 16,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  direction: 'ltr',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <textarea
                placeholder="יש לך שאלה? כתוב כאן ונחזור אליך בווצאפ"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: 15,
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  direction: 'rtl',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />

              {/* Marketing consent checkbox */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                cursor: 'pointer',
                direction: 'rtl',
              }}>
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  style={{
                    marginTop: 3,
                    width: 18,
                    height: 18,
                    accentColor: '#22C55E',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: '#9CA3AF', fontSize: 13, lineHeight: 1.5 }}>
                  אני מסכים/ה לקבל עדכונים על סדנאות והצעות נוספות מאביץ — הארכיטקט
                </span>
              </label>

              {errorMessage && (
                <p style={{ color: '#EF4444', textAlign: 'center', fontSize: 14 }}>
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#0a0a0a',
                  background: status === 'loading'
                    ? '#6B7280'
                    : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  borderRadius: 12,
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 30px rgba(34, 197, 94, 0.4)',
                }}
              >
                {status === 'loading' ? 'שולח...' : 'הרשמה עכשיו'}
              </button>
            </form>

            {status === 'success' && (
              <div style={{
                marginTop: 16,
                padding: '12px 16px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: 10,
                border: '1px solid rgba(34, 197, 94, 0.3)',
                textAlign: 'center',
              }}>
                <p style={{ color: '#22C55E', fontSize: 15, fontWeight: 600 }}>
                  נרשמת בהצלחה! מועבר לדף התשלום...
                </p>
              </div>
            )}
          </div>

          <p style={{ color: '#6B7280', fontSize: 13, marginTop: 16 }}>
            תשלום מאובטח דרך מורנינג • חשבונית מס אוטומטית
          </p>
          <p style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
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
      </section>

      {/* FAQ */}
      <section style={{
        padding: '60px 20px',
        background: '#0a0a0a',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: 32 }}>
            שאלות נפוצות
          </h2>
          {[
            {
              q: 'אני לא מתכנת. זה מתאים לי?',
              a: 'בהחלט. הסדרה מיועדת לבעלי עסקים, מנהלים ואנשי מקצוע שרוצים להשתמש ב-AI לעבודה יומיומית. לא כותבים שורת קוד אחת.',
            },
            {
              q: 'מה זה Claude Code?',
              a: 'סוכן AI של Anthropic שיודע לבצע משימות מורכבות: לשלוח מיילים, ליצור מסמכים, לנהל לקוחות, ליצור תוכן — הכל מתוך שיחה אחת.',
            },
            {
              q: 'מה אם אני מפספס מפגש?',
              a: 'כל שיעור מועבר פעמיים באותו שבוע — יום שני בערב ויום חמישי בבוקר. בנוסף, כל המפגשים מוקלטים.',
            },
            {
              q: 'מה צריך להכין לפני?',
              a: 'רק מנוי Claude פעיל (claude.ai). במפגש הראשון מתקינים הכל ביחד, צעד אחר צעד.',
            },
            {
              q: 'יש הקלטות?',
              a: 'כן. כל המפגשים מוקלטים ונגישים למשתתפים.',
            },
          ].map((faq, i) => (
            <div key={i} style={{
              marginBottom: 20,
              padding: '20px 24px',
              background: '#1F2937',
              borderRadius: 12,
              border: '1px solid #374151',
              textAlign: 'right',
            }}>
              <h3 style={{ color: '#22C55E', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ color: '#D1D5DB', fontSize: 15, lineHeight: 1.6 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        background: '#0a0a0a',
        borderTop: '1px solid #1F2937',
        textAlign: 'center',
      }}>
        <p style={{ color: '#22C55E', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
          אביץ — הארכיטקט
        </p>
        <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 16 }}>
          מלמד בעלי עסקים לבנות מערכות AI שעובדות בשבילם
        </p>
        <a
          href="https://linktr.ee/aviz85"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#22C55E', fontSize: 14, textDecoration: 'none' }}
        >
          linktr.ee/aviz85
        </a>
      </footer>
    </div>
  )
}
