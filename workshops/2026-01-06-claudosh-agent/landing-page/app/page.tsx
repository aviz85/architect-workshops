'use client'

import { useEffect, useRef, useState } from 'react'

const faqData = [
  {
    q: 'למי הסדרה מיועדת?',
    a: 'לבעלי עסקים, מנהלים, עצמאים ואנשי מקצוע שרוצים להפסיק לעשות הכל ידנית ולבנות מערכת AI שעובדת בשבילם. לא צריך רקע טכני — הסדרה בנויה למי שיודע להשתמש במחשב ומוכן ללמוד כלי חדש. המשותף למשתתפים: סקרנות, נכונות לנסות, ורצון אמיתי לשנות את הדרך שבה הם עובדים.',
  },
  {
    q: 'מה זה Claude Code? מה ההבדל מ-ChatGPT?',
    a: 'Claude Code הוא סוכן AI שרץ על המחשב שלך ויכול לבצע פעולות אמיתיות — לא רק לענות על שאלות. ההבדל מ-ChatGPT: ChatGPT הוא צ\'אטבוט שעונה בתוך חלון. Claude Code הוא סוכן שניגש לקבצים, שולח הודעות, מייצר מסמכים — ועובד גם כשאתה לא שם. אתה מדבר אליו בעברית פשוטה, והוא מבצע.',
  },
  {
    q: 'צריך לדעת לתכנת?',
    a: 'ממש לא. הסדרה בנויה למי שלא כתב שורת קוד בחיים. Claude Code עובד בשיחה — אתה מתאר מה אתה צריך, והסוכן עושה. אם אתה יודע לכתוב הודעה בווצאפ — יש לך את כל מה שצריך.',
  },
  {
    q: 'מה אם אני מפספס מפגש?',
    a: 'כל המפגשים מוקלטים וזמינים לצפייה חוזרת. בנוסף, יש קבוצת WhatsApp שבה אפשר לשאול שאלות ולקבל עזרה.',
  },
  {
    q: 'מה צריך להכין לפני המפגש הראשון?',
    a: 'מחשב (Mac, Windows או Linux), חיבור אינטרנט יציב, ומנוי Claude פעיל (claude.ai — $20 לחודש). את ההתקנה של Claude Code נעשה ביחד במפגש הראשון.',
  },
  {
    q: 'כמה זמן כל מפגש?',
    a: 'כל מפגש נמשך כשעתיים. זה מפגש מעשי שבו אתה בונה דברים אמיתיים — לא הרצאה תיאורטית.',
  },
  {
    q: 'אפשר להצטרף רק למפגש אחד?',
    a: 'כן, אפשר לרכוש מפגש בודד ב-₪150. אבל הסדרה המלאה נבנתה כמסע מצטבר — כל מפגש בונה על הקודם, ובחבילה המלאה אתה חוסך ₪100.',
  },
  {
    q: 'באיזו שפה המפגשים?',
    a: 'הכל בעברית. ההוראה, המדריכים, התמיכה — הכל בשפה שלך.',
  },
  {
    q: 'מה ההבדל בין הסדרה הזו לקורסים אחרים?',
    a: 'פה לא לומדים תיאוריה — בונים. בכל מפגש יוצאים עם משהו שעובד. בנוסף, זו הסדרה היחידה בעברית שמתמקדת בבניית מערכת סוכנים מלאה, לא רק בשימוש בכלי יחיד.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-arrow">&#9660;</span>
      </button>
      <div className="faq-answer">
        <p>{a}</p>
      </div>
    </div>
  )
}

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.fade-in').forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function LandingPage() {
  const pageRef = useFadeIn()

  return (
    <div ref={pageRef}>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AVIZ — THE ARCHITECT</div>
          <h1>סידרת <span>קלודוש</span></h1>
          <p className="hero-tagline">מאפס לצבא סוכנים</p>
          <p className="hero-desc">
            4 מפגשים מעשיים שבהם אתה בונה — בידיים שלך — מערכת סוכני AI שעובדת בשבילך 24/7.
            בלי לכתוב שורת קוד אחת.
          </p>
          <a href="#pricing" className="hero-cta">שריינו לי מקום</a>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">4</div>
              <div className="hero-stat-label">מפגשים</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">0</div>
              <div className="hero-stat-label">שורות קוד</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">100%</div>
              <div className="hero-stat-label">מעשי</div>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="pain-section">
        <div className="container">
          <div className="fade-in">
            <div className="green-sep" />
            <h2 className="section-title">על איזה כאב הסדרה עונה?</h2>
            <p className="section-subtitle">אם אתה מזהה את עצמך באחד מהמצבים האלה — הסדרה הזו נבנתה בשבילך.</p>
          </div>
          <div className="pain-grid">
            <div className="pain-card fade-in">
              <div className="pain-icon">😵‍💫</div>
              <div className="pain-title">העומס היומיומי</div>
              <p className="pain-text">אתה קופץ בין 20 טאבים, מעתיק-מדביק בין אפליקציות, מנהל הכל ידנית. כל יום אותו דבר — ואין לך רגע לנשום.</p>
            </div>
            <div className="pain-card fade-in">
              <div className="pain-icon">🤖</div>
              <div className="pain-title">AI שלא עובד באמת</div>
              <p className="pain-text">ניסית ChatGPT או Claude, אבל זה מרגיש כמו גוגל משופר. שואלים, מקבלים תשובה, שוכחים — ומתחילים מחדש.</p>
            </div>
            <div className="pain-card fade-in">
              <div className="pain-icon">🧱</div>
              <div className="pain-title">חסם הטכנולוגיה</div>
              <p className="pain-text">כל המדריכים מדברים על &quot;קוד&quot; ו&quot;תכנות&quot;. אתה מרגיש שזה לא בשבילך, למרות שאתה יודע שיש פה ערך עצום.</p>
            </div>
            <div className="pain-card fade-in">
              <div className="pain-icon">⏰</div>
              <div className="pain-title">אין זמן לקורס ארוך</div>
              <p className="pain-text">אין לך שבועות להשקיע בלמידה תיאורטית. אתה צריך משהו שנותן ערך מיידי ומצטבר — מהמפגש הראשון.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE 4 SESSIONS */}
      <section className="sessions-section">
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="green-sep center" />
            <h2 className="section-title" style={{ marginBottom: 12 }}>4 מפגשים. מערכת שלמה.</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>כל מפגש נבנה על הקודם. מה שבנית — ממשיך לעבוד ולצבור ערך.</p>
          </div>
          <div className="session-cards">
            <div className="session-card fade-in">
              <div className="session-number">01</div>
              <div className="session-emoji">🚀</div>
              <div className="session-date">יום שני 16.02 | 21:00</div>
              <h3 className="session-name">הסוכן הכללי כבר כאן</h3>
              <p className="session-desc">מתקינים את הסוכן, מלמדים אותו מי אתה, ורואים אותו מבצע את המשימה הראשונה. הרגע שבו מבינים שזה משהו אחר לגמרי.</p>
              <ul className="session-topics">
                <li>התקנת Claude Code צעד אחר צעד</li>
                <li>כתיבת הזיכרון הראשון — הסוכן &quot;מכיר&quot; אותך</li>
                <li>סקיל ראשון מהספרייה</li>
                <li>הבנת קונטקסט — למה זה הכל</li>
              </ul>
            </div>
            <div className="session-card fade-in">
              <div className="session-number">02</div>
              <div className="session-emoji">🛸</div>
              <div className="session-date">יום שני 23.02 | 21:00</div>
              <h3 className="session-name">ערימות של סקילים</h3>
              <p className="session-desc">בונים פרויקטים אמיתיים — CRM, מנוע תוכן, חיבור ביניהם. ריבוי חלונות, ריבוי פרויקטים — מצב חללית.</p>
              <ul className="session-topics">
                <li>CRM אישי עם הצעות מחיר אוטומטיות</li>
                <li>חיבור ל-WhatsApp ומיילים</li>
                <li>ראיון עומק — הסוכן לומד את העסק שלך</li>
                <li>עבודה חוצה-פרויקטים</li>
              </ul>
            </div>
            <div className="session-card fade-in">
              <div className="session-number">03</div>
              <div className="session-emoji">🛰️</div>
              <div className="session-date">יום חמישי 05.03 | 21:00</div>
              <h3 className="session-name">אפליקציות סוכניות</h3>
              <p className="session-desc">בונים אפליקציות שרצות על סוכנים — עם hooks, אבטחה, תזמון משימות. הסוכן מתחיל לעבוד גם כשאתה לא שם.</p>
              <ul className="session-topics">
                <li>בניית אפליקציה סוכנית מאפס</li>
                <li>Hooks ואבטחה — שליטה מדויקת</li>
                <li>תזמון משימות אוטומטי</li>
                <li>הסוכן עובד 24/7</li>
              </ul>
            </div>
            <div className="session-card fade-in">
              <div className="session-number">04</div>
              <div className="session-emoji">🌌</div>
              <div className="session-date">יום שני 09.03 | 21:00</div>
              <h3 className="session-name">נחילי סוכנים</h3>
              <p className="session-desc">הנחיל מתעורר. צוותי סוכנים, הגנה מפני prompt injection, מרכז פיקוד בווצאפ — ומערכת הפעלה אישית מלאה.</p>
              <ul className="session-topics">
                <li>נחיל סוכנים — כמה סוכנים על משימה אחת</li>
                <li>הגנה מפני prompt injection</li>
                <li>מרכז פיקוד WhatsApp</li>
                <li>מערכת הפעלה אישית — Personal OS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SYLLABUS DOWNLOAD */}
      <section className="syllabus-download">
        <div className="container fade-in">
          <div className="syllabus-box">
            <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--white)', marginBottom: 8 }}>
              📄 רוצים לראות את הסיליבוס המלא?
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--gray-400)', marginBottom: 20 }}>
              6 עמודים עם פירוט מלא של כל מפגש, מושגי יסוד, ומה מקבלים.
            </p>
            <a
              href="https://aviz85.github.io/claudosh-series/syllabus-v2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="syllabus-btn"
            >
              הורדת הסיליבוס (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* THE JOURNEY */}
      <section className="journey-section">
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="green-sep center" />
            <h2 className="section-title">המסע: מרצועה קצרה לחירות מלאה</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>בכל מפגש אתה נותן לסוכן עוד חופש פעולה — עד שהוא עובד בשבילך לגמרי.</p>
          </div>
          <div className="journey-track fade-in">
            <div className="journey-line" />
            <div className="journey-steps">
              <div className="journey-step">
                <div className="journey-dot">🚀</div>
                <div className="journey-label">מפגש 1</div>
                <div className="journey-sublabel">רצועה קצרה</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 6 }}>אתה ליד המחשב, צופה בכל צעד</p>
              </div>
              <div className="journey-step">
                <div className="journey-dot">🛸</div>
                <div className="journey-label">מפגש 2</div>
                <div className="journey-sublabel">רצועה ארוכה</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 6 }}>שולח משימה, הולך לעשות קפה</p>
              </div>
              <div className="journey-step">
                <div className="journey-dot">🛰️</div>
                <div className="journey-label">מפגש 3</div>
                <div className="journey-sublabel">חצי-חופשי</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 6 }}>הסוכן עובד גם כשאתה לא שם</p>
              </div>
              <div className="journey-step">
                <div className="journey-dot">🌌</div>
                <div className="journey-label">מפגש 4</div>
                <div className="journey-sublabel">חירות מלאה</div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 6 }}>הנחיל עובד, אתה מנהל מהנייד</p>
              </div>
            </div>
            <div className="leash-indicator">
              <div className="leash-end"><span className="arrow">←</span> שליטה צמודה</div>
              <div className="leash-end">אוטונומיה מלאה <span className="arrow">→</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="benefits-section">
        <div className="container">
          <div className="fade-in">
            <div className="green-sep" />
            <h2 className="section-title">מה מקבלים?</h2>
            <p className="section-subtitle">כל מה שצריך כדי לבנות מערכת סוכני AI מלאה — ולהמשיך לצמוח אחרי הסדרה.</p>
          </div>
          <div className="benefits-grid">
            {[
              '4 מפגשי לייב בזום עם בנייה בזמן אמת',
              'הקלטות מלאות של כל המפגשים — לצפייה חוזרת',
              'מדריכים כתובים צעד-אחר-צעד לכל מפגש',
              'ספריית סקילים מוכנה להתקנה מיידית',
              'קבוצת WhatsApp לתמיכה שוטפת',
              'תמיכה אישית מאביץ',
              'ערכת כלים ואינטגרציות (WhatsApp, מייל, תמונות)',
              'גישה לקהילת בוגרים להמשך למידה',
            ].map((text, i) => (
              <div key={i} className="benefit-item fade-in">
                <div className="benefit-check">✓</div>
                <div className="benefit-text">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE */}
      <section className="audience-section">
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="green-sep center" />
            <h2 className="section-title">למי הסדרה מיועדת?</h2>
          </div>
          <div className="audience-grid fade-in">
            <div className="audience-card">
              <div className="audience-icon">💼</div>
              <div className="audience-title">בעלי עסקים</div>
              <p className="audience-desc">שרוצים לייעל תהליכים, להוציא הצעות מחיר, לנהל לקוחות ולשווק — עם פחות מאמץ ויותר עקביות. הסוכן הופך ל&quot;עובד&quot; שמכיר את העסק שלך.</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">👔</div>
              <div className="audience-title">מנהלים ואנשי מקצוע</div>
              <p className="audience-desc">שעושים את אותן משימות שוב ושוב — מיילים, דוחות, הצעות, תיאום. הסוכן לוקח על עצמו את המשימות החוזרות ומשחרר אותך לדברים חשובים.</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">🎯</div>
              <div className="audience-title">סקרנים טכנולוגיים</div>
              <p className="audience-desc">ששמעו על סוכני AI ורוצים להבין מה זה באמת — ולבנות משהו עובד, לא רק לקרוא על זה. Early Adopters שמוכנים להוביל.</p>
            </div>
          </div>
          <div className="audience-note fade-in" style={{ marginBottom: 20 }}>
            <div className="audience-note-icon">🚫</div>
            <div className="audience-note-text">
              <strong>לא צריך ניסיון בתכנות. בכלל.</strong><br />
              אם אתה יודע לכתוב הודעה בווצאפ — אתה יודע מספיק. הסדרה לא מלמדת קוד.{' '}
              <strong>Claude Code הוא כלי שעובד בשיחה</strong> — אתה מתאר מה אתה צריך בעברית פשוטה, והסוכן מבצע.
              אתה הופך ממבצע למנהל: שולח משימה, הולך לעשות משהו אחר, וחוזר לתוצאה מוכנה.
            </div>
          </div>
          <div className="audience-note fade-in">
            <div className="audience-note-icon">⚠️</div>
            <div className="audience-note-text">
              <strong>הסדרה לא מתאימה למי שמחפש הרצאת השראה.</strong><br />
              זו סדנה מעשית. אתה מתקין, בונה, ויוצא עם מערכת עובדת. צריך להגיע עם מחשב, עם נכונות לנסות, ועם סבלנות ללמוד כלי חדש. מי שמוכן — יוצא עם משהו שמשנה את היומיום.
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="fade-in" style={{ marginBottom: 48 }}>
            <div className="green-sep center" />
            <h2 className="section-title">מחירים</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>בחרו את המסלול שמתאים לכם.</p>
          </div>
          <div className="fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
            <div className="pricing-card featured" style={{ borderRadius: 20 }}>
              <div className="pricing-label" style={{ fontSize: '1.1rem', marginBottom: 16 }}>הסדרה המלאה — 4 מפגשים</div>
              <div className="pricing-amount">₪500</div>
              <div className="pricing-period">4 מפגשים × שעתיים | 8 שעות של בנייה</div>
              <ul className="pricing-features" style={{ margin: '20px auto', maxWidth: 320 }}>
                <li>4 מפגשי לייב בזום עם בנייה בזמן אמת</li>
                <li>הקלטות מלאות + מדריכים כתובים</li>
                <li>ספריית סקילים + תבניות מוכנות</li>
                <li>קבוצת WhatsApp + תמיכה אישית מאביץ</li>
                <li>גישה לקהילת בוגרים</li>
              </ul>
              <a
                href="https://mrng.to/T8sXLy6nZi"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn pricing-btn-filled"
                style={{ maxWidth: 320, margin: '0 auto', fontSize: '1.15rem', padding: '16px 32px' }}
              >
                לדף התשלום
              </a>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: 16 }}>אפשר גם מפגש בודד ב-₪150</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="green-sep center" />
            <h2 className="section-title">שאלות נפוצות</h2>
          </div>
          <div className="faq-list fade-in">
            {faqData.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section">
        <div className="container">
          <div className="fade-in">
            <div className="green-sep center" />
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>מי מלמד?</h2>
          </div>
          <div className="about-content fade-in">
            <div className="about-avatar">👨‍💻</div>
            <div className="about-text">
              <h3>אביץ — הארכיטקט</h3>
              <div className="about-role">בונה מערכות סוכני AI | מרצה ומנחה סדנאות</div>
              <p>
                אביץ חי ונושם סוכני AI. הוא בנה לעצמו מערכת הפעלה אישית מלאה שמנהלת לקוחות, מייצרת תוכן, שולחת הודעות, מכינה הצעות מחיר — הכל דרך שיחה פשוטה עם הסוכנים שלו.
              </p>
              <p>
                בסדרת קלודוש הוא מלמד את כל מי שרוצה לבנות את אותה מערכת — צעד אחר צעד, בלי קוד, בעברית.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="fade-in">
            <h2>מוכנים <span className="green-accent">להמריא</span>?</h2>
            <p>הצטרפו לסידרת קלודוש ובנו את מערכת הסוכנים שתעבוד בשבילכם.</p>
            <a href="https://mrng.to/T8sXLy6nZi" target="_blank" rel="noopener noreferrer" className="hero-cta">לדף התשלום</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">AVIZ — THE ARCHITECT</div>
        <div className="footer-copy">סידרת קלודוש — מאפס לצבא סוכנים</div>
        <p style={{ fontSize: '0.75rem', color: '#3a3a3a', marginTop: 12 }}>
          שאלות?{' '}
          <a href="https://wa.me/972503973736" target="_blank" rel="noopener noreferrer" style={{ color: '#22C55E' }}>
            פנו לאביץ בוואטסאפ
          </a>
          {' | '}
          <a href="https://architect.master-x.co.il/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#3a3a3a', textDecoration: 'underline' }}>
            מדיניות פרטיות
          </a>
        </p>
      </footer>
    </div>
  )
}
