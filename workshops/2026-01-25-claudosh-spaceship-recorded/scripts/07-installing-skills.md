# פרק 7: התקנת סקילים וחיבור אינטגרציות

## מבוא (15 שניות)

עד עכשיו בנינו סקילים מאפס.
אבל למה להמציא את הגלגל?

יש סקילים מוכנים. יש אינטגרציות מוכנות.
בואו נתקין אותם.

---

## ספריית הסקילים (60 שניות)

### איפה מוצאים סקילים?

**ספרייה רשמית:**
```
github.com/aviz85/claude-skills-library
```

**מה יש שם:**
- סקילים לתוכן (כתיבה, עריכה, פרסום)
- סקילים לעסקים (הצעות מחיר, חשבוניות)
- סקילים לתקשורת (מייל, וואצאפ)
- סקילים ליצירה (תמונות, PDF, וידאו)

**כל סקיל כולל:**
- הוראות התקנה
- דוגמאות שימוש
- דרישות (API keys אם צריך)

---

## איך מתקינים סקיל? (90 שניות)

### שלב 1: הורדת הספרייה

```bash
cd ~
git clone https://github.com/aviz85/claude-skills-library
```

### שלב 2: בחירת סקיל

נניח שרוצים את `presentation-architect`:

```bash
ls claude-skills-library/skills/
# רואים את כל הסקילים הזמינים
```

### שלב 3: העתקה למקום הנכון

**Mac/Linux:**
```bash
cp -r claude-skills-library/skills/presentation-architect ~/.claude/skills/
```

**Windows (PowerShell):**
```powershell
Copy-Item -Recurse claude-skills-library\skills\presentation-architect $env:USERPROFILE\.claude\skills\
```

### שלב 4: בדיקה

```bash
cc
> "תכין לי מצגת על AI"
```

**אם עובד - מעולה!**

---

## סוגי אינטגרציות (60 שניות)

### אינטגרציות פשוטות (בלי API)

סקילים שעובדים מיד:
- `presentation-architect` - יצירת מצגות
- `content-writer` - כתיבת תוכן
- `file-organizer` - ארגון קבצים

### אינטגרציות עם API

סקילים שצריכים מפתח:
- **תמונות:** Gemini API / DALL-E
- **קול:** ElevenLabs
- **מייל:** Google Apps Script
- **וואצאפ:** Green API / WAHA

### איך מגדירים API?

בדרך כלל יש קובץ `.env` או הגדרה ב-CLAUDE.md:

```markdown
## API Keys
- GEMINI_API_KEY: [המפתח שלך]
- ELEVENLABS_API_KEY: [המפתח שלך]
```

---

## חיבור מייל (Gmail) (90 שניות)

### למה Google Apps Script?

- חינם
- אין צורך בשרת
- גישה ישירה ל-Gmail

### השלבים:

**1. פתחו Google Apps Script:**
```
script.google.com
```

**2. צרו פרויקט חדש**

**3. הדביקו את הקוד:**
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  GmailApp.sendEmail(data.to, data.subject, data.body);
  return ContentService.createTextOutput("Sent");
}
```

**4. פרסמו כ-Web App**
- Execute as: Me
- Access: Anyone

**5. קבלו URL ושמרו בסקיל**

### עכשיו Claude יכול לשלוח מיילים!

```
> "שלח מייל לחיים@דוגמה.com עם סיכום הפגישה"
```

---

## חיבור וואצאפ (Green API) (60 שניות)

### למה Green API?

- פשוט להתקנה
- עובד עם וואצאפ רגיל
- יש תוכנית חינמית לניסיון

### השלבים:

**1. הירשמו:**
```
green-api.com
```

**2. חברו את הטלפון** (סרקו QR)

**3. קבלו:**
- Instance ID
- API Token

**4. הגדירו בסקיל:**
```markdown
## WhatsApp Config
- GREENAPI_INSTANCE: 12345678
- GREENAPI_TOKEN: abc123...
```

### עכשיו Claude יכול לשלוח וואצאפ!

```
> "שלח לחיים בוואצאפ תזכורת על הפגישה מחר"
```

---

## חיבור יצירת תמונות (45 שניות)

### Gemini (מומלץ)

**1. קבלו API key:**
```
makersuite.google.com/app/apikey
```

**2. הגדירו:**
```markdown
## Image Generation
GEMINI_API_KEY: your_key_here
```

**3. השתמשו:**
```
> "צור תמונה של לוגו לעסק שלי"
```

### חלופות:
- **DALL-E:** דרך OpenAI API
- **Midjourney:** דרך Discord API
- **fal.ai:** זול ומהיר

---

## טיפים להתקנה בטוחה (45 שניות)

### 1. אל תשתפו API keys

❌ לא לשים ב-GitHub
❌ לא לשלוח בצ'אט
✅ שמרו בקובץ `.env` שלא נכנס ל-git

### 2. בדקו הרשאות

כל אינטגרציה - בדקו מה היא יכולה לעשות:
- האם יכולה למחוק?
- האם יכולה לשלוח לכולם?

### 3. התחילו בסנדבוקס

- מייל: שלחו לעצמכם קודם
- וואצאפ: שלחו לעצמכם קודם
- תמונות: בדקו שהתוצאה טובה

### 4. שמרו גיבוי

לפני שמתקינים משהו חדש - גבו את תיקיית `.claude`

---

## סיכום (15 שניות)

התקנת סקילים = 3 צעדים:
1. הורד
2. העתק לתיקייה
3. הגדר API (אם צריך)

אינטגרציות = כוח-על:
- מייל, וואצאפ, תמונות, PDF
- הכל בפקודה אחת

בפרק הבא נראה דוגמאות אמיתיות: הקלטה, וואצאפ, וידע ארגוני.

---

## הערות הפקה

- **אורך משוער:** 7-8 דקות
- **ויזואליה:**
  - Screen recording של התקנה
  - דיאגרמה של API flow
  - לפני/אחרי: בלי אינטגרציה vs עם
- **טון:** טכני אבל נגיש, "זה לא מפחיד"
- **מוזיקה:** קצבית, מעשית
