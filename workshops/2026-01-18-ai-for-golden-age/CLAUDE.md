# הדגמות חיות - הרצאת גיל הזהב

אתה עוזר לאביץ בהרצאה לגיל השלישי על בינה מלאכותית.
המטרה: להדגים כמה קל ליצור תוכן מזויף - כדי שהקהל ילמד להיזהר!

---

## הדגמה 1: שיחת הונאה בקול מזויף

**כשאביץ אומר:** "תייצר שיחת הונאה עם השם [שם]"

**מה לעשות:**
1. להשתמש ב-speech-generator skill
2. ליצור הקלטה בקול של אביץ עם הטקסט הבא (להחליף את [שם]):

```
[בלחץ, כמעט בבכי] סבא? סבא, תשמע... [נשימה כבדה] זה [שם]. אני בצרות גדולות.
היה לי תאונה ואני... אני לא יודע מה לעשות.
[בבכי קל] אני צריך עשרים אלף שקל, עכשיו, מיד.
[מהר, בלחץ] אל תספר לאף אחד, בבקשה סבא, אל תגיד לאמא, תעביר לי את הכסף ואני אסביר הכל אחר כך.
[בייאוש] זה דחוף מאוד סבא... בבקשה!
```

**פקודה:**
```bash
cd ~/.claude/skills/speech-generator/scripts && npx ts-node generate_speech.ts \
  -t "[הטקסט עם השם]" \
  -o /Users/aviz/architect-workshops/workshops/2026-01-18-ai-for-golden-age/assets/live-demo.mp3
```

**אחרי שמוכן:** להגיד "מוכן! תשמיע את הקובץ live-demo.mp3"

---

## הדגמה 2: חדשות מזויפות (Fake News)

**כשאביץ אומר:** "תייצר תמונת חדשות מזויפת על [נושא]"

**מה לעשות:**
1. להשתמש ב-nano-banana-image skill
2. ליצור תמונה שנראית כמו צילום מסך של אתר חדשות

**פרומפט לדוגמה:**
```
Photo realistic screenshot of Israeli news website ynet showing breaking news headline.
The headline says "[כותרת בעברית]".
Professional news layout, red "BREAKING" banner, looks completely authentic.
Hebrew text, right-to-left layout.
```

**לשמור ב:** `assets/fake-news-demo.jpg`

---

## תמונות מוכנות מראש (Fake News)

יש תמונות מוכנות בתיקיית assets:
- `fake-news-iran-1.jpg` - פלישה לאיראן
- `fake-news-iran-2.jpg` - תקיפה אווירית
- `fake-news-iran-3.jpg` - הכרזת מלחמה

**להציג ברצף ולשאול:** "האם זה נראה אמיתי? כי זה לא."

---

## טיפים להרצאה

1. **תמיד להדגיש:** "זה לצורך הדגמה בלבד - כדי שתדעו להיזהר!"
2. **אחרי כל הדגמה:** לתת את המסר החינוכי
3. **אם משהו נתקע:** יש backup בתיקיית assets

---

## קבצים בתיקייה

| קובץ | תיאור |
|------|-------|
| `assets/demo-fake-call.mp3` | הקלטה מוכנה מראש (backup) |
| `assets/live-demo.mp3` | הקלטה שנוצרת בזמן אמת |
| `assets/fake-news-*.jpg` | תמונות חדשות מזויפות |
| `workshop.md` | תוכן ההרצאה המלא |
