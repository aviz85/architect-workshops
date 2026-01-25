# בונוס 3: אנימציה עם Remotion

## מה זה Remotion? (30 שניות)

**Remotion = וידאו בקוד**

במקום After Effects או Premiere -
כותבים React ומקבלים סרטון.

**למה זה מדהים עם Claude Code?**

כי Claude יודע לכתוב קוד.
ואם וידאו זה קוד - Claude יכול ליצור וידאו!

---

## מה אפשר לעשות? (60 שניות)

### 1. סרטוני טקסט (Kinetic Typography)

```
> "צור סרטון עם הציטוט: 'העתיד שייך למי שמתחיל היום'"
```

טקסט מונפש, אפקטים, מוזיקה.

### 2. אינפוגרפיקה מונפשת

```
> "צור סרטון שמציג את הנתונים מ-sales.csv"
```

גרפים שזזים, מספרים שעולים.

### 3. פרומו קצר

```
> "צור סרטון 15 שניות לסדנה"
```

לוגו, כותרות, CTA.

### 4. הסברים

```
> "צור אנימציה שמסבירה איך Claude Code עובד"
```

דיאגרמות מונפשות.

---

## התקנת Remotion (60 שניות)

### שלב 1: יצירת פרויקט

```bash
npx create-video@latest my-video
cd my-video
npm install
```

### שלב 2: הרצה

```bash
npm start
```

נפתח דפדפן עם preview.

### שלב 3: רינדור

```bash
npx remotion render src/index.ts Video out/video.mp4
```

### מה מקבלים:

```
my-video/
├── src/
│   ├── index.ts          # Entry point
│   ├── Video.tsx         # הקומפוזיציה הראשית
│   └── components/       # רכיבים
├── public/               # נכסים (תמונות, פונטים)
└── out/                  # וידאו מרונדר
```

---

## Claude + Remotion (90 שניות)

### איך זה עובד:

**1. אתם אומרים מה רוצים:**
```
> "צור סרטון שמציג 3 יתרונות של Claude Code"
```

**2. Claude כותב קוד React:**
```tsx
export const Advantages: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={60}>
        <Title>יתרון 1: מהירות</Title>
      </Sequence>
      <Sequence from={60} durationInFrames={60}>
        <Title>יתרון 2: דיוק</Title>
      </Sequence>
      <Sequence from={120} durationInFrames={60}>
        <Title>יתרון 3: אוטומציה</Title>
      </Sequence>
    </AbsoluteFill>
  );
};
```

**3. אתם מרנדרים:**
```bash
npx remotion render ...
```

**4. יש לכם סרטון!**

---

## סקיל ליצירת וידאו (60 שניות)

```markdown
# create-remotion-video

## מטרה
ליצור סרטון באמצעות Remotion.

## קלט
- נושא/מסר לסרטון
- אורך רצוי (שניות)
- סגנון (מינימליסטי/צבעוני/עסקי)

## תהליך
1. הבן את הבקשה
2. תכנן את המבנה (scenes)
3. כתוב קוד React עם Remotion
4. שמור ב-src/compositions/[שם].tsx
5. עדכן index.ts
6. הרץ preview

## כללי עיצוב
- רקע כהה: #1a1a2e
- צבע מדגיש: #22C55E (ירוק)
- פונט: Heebo (עברית)
- 30fps
- 1080p

## אחרי יצירה
הודע למשתמש:
"הקומפוזיציה מוכנה. הרץ npm start לצפות ב-preview"
```

---

## דוגמה מלאה (90 שניות)

**הבקשה:**
```
> "צור סרטון 10 שניות עם הטקסט:
   'Claude Code - הסוכן שעובד בשבילך'
   עם אפקט של התגלות"
```

**הקוד ש-Claude כותב:**
```tsx
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    { easing: Easing.ease }
  );

  const scale = interpolate(
    frame,
    [0, 30],
    [0.8, 1],
    { easing: Easing.ease }
  );

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        color: '#22C55E',
        fontSize: 60,
        fontFamily: 'Heebo',
        textAlign: 'center',
      }}>
        Claude Code
        <div style={{ fontSize: 40, color: 'white', marginTop: 20 }}>
          הסוכן שעובד בשבילך
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**התוצאה:**
טקסט ירוק שמופיע בהדרגה על רקע כהה.

---

## טיפים (30 שניות)

### 1. התחילו פשוט

טקסט → אנימציה בסיסית → אפקטים מורכבים

### 2. שמרו templates

כל סרטון טוב = תבנית לעתיד

### 3. פונטים עבריים

```tsx
import '@fontsource/heebo';
```

### 4. אורך = פריימים

10 שניות × 30fps = 300 פריימים

---

## לסיכום (15 שניות)

**Remotion + Claude Code = מפעל וידאו**

- אתם אומרים מה רוצים
- Claude כותב קוד
- אתם מקבלים סרטון

זה העתיד של יצירת תוכן.

---

## הערות הפקה

- **אורך משוער:** 6-7 דקות
- **ויזואליה:**
  - דוגמאות של סרטונים ש-Remotion יכול לעשות
  - קוד על המסך
  - תוצאה סופית
- **טון:** מגניב, "וואו זה אפשרי?"
