# פרק 6: הודעות, תורים וStreaming

## זרימת הודעה - מ-WhatsApp עד תשובה

```
📱 הודעה נכנסת
     ↓
🔑 Routing → Session Key
     ↓
⏳ Queue (אם הסוכן עסוק)
     ↓
🤖 Agent Run (AI + כלים)
     ↓
📤 תשובה יוצאת
```

---

## Debouncing - קיבוץ הודעות מהירות

**בעיה:** אדם שולח 3 הודעות תוך 2 שניות - האם הסוכן מריץ 3 פעמים?

**פתרון:** Debouncing - המתן 2000ms ואז אסוף הכל לריצה אחת.

```json
messages.inbound.debounceMs: 2000  // ברירת מחדל
```

**חריגים** (לא עוברים debounce):
- הודעות עם מדיה (תמונה, אודיו) - מיד!
- פקודות מערכת (`/stop`, `/new`)

---

## Queue - ניהול תור

**מה קורה אם הסוכן עסוק ומגיעה הודעה חדשה?**

### מצבי Queue

| מצב | מה קורה |
|-----|---------|
| `collect` (ברירת מחדל) | אסוף הכל, שלח אחרי שהסוכן מסיים - הכל ביחד |
| `followup` | הכנס לתור - הסוכן יטפל אחרי |
| `steer` | הזרק ל-run הנוכחי (בגבול הכלי הבא) |
| `steer-backlog` | הזרק עכשיו + שמור גם לfollow-up |
| `interrupt` (ישן) | עצור run נוכחי, התחל עם ההודעה החדשה |

**ברירת מחדל `collect`:** הכי בטוח - לא מפריע לעבודה השוטפת.

### הגדרת Queue
```json
{
  messages: {
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,          // מקסימום בתור
      drop: "summarize" // מה לעשות אחרי מלא
    }
  }
}
```

### שינוי בצ'אט
```
/queue collect
/queue steer
/queue collect debounce:2s cap:25 drop:summarize
/queue default  → חזור לברירת מחדל
```

### Overflow Policy
```
old       → מחק ישנות
new       → מחק חדשות
summarize → תקצר ישנות (ברירת מחדל)
```

---

## Streaming - שידור התשובה

OpenClaw תומך בשתי שכבות streaming:

### 1. Block Streaming - לערוצי צ'אט
שלח חלקים מהתשובה **כשהם מוכנים** (ולא בסוף):

```json
agents.defaults.blockStreamingDefault: "on" / "off"
```

**אלגוריתם הפיצול:**
- מינימום לפני שליחה: `minChars`
- מקסימום: `maxChars`
- מועדף: paragraph → newline → sentence → word
- **חוק:** code fence לעולם לא נפרץ באמצע

### 2. Preview Streaming - Telegram/Discord/Slack
עדכן הודעה זמנית בזמן שהסוכן עובד:

```
מצבים: off | partial | block | progress
```

---

## Chunking - פיצול תשובות ארוכות

WhatsApp / Telegram מגבילים אורך הודעה. OpenClaw מפצל:

```json
blockStreamingChunk: {
  minChars: 100,
  maxChars: 2000,
  breakPreference: "paragraph"
}
```

**Coalescing - מיזוג חזרה:**
```json
blockStreamingCoalesce: {
  minChars: 500,
  maxChars: 3000,
  idleMs: 500
}
```
ממזג חלקים קטנים לפני שליחה - מונע "ספאם" של הודעות קטנות.

---

## Human Delay - השהייה אנושית

כדי שהסוכן לא יגיב מיידית כמו רובוט:

```json
agents.defaults.humanDelay: {
  mode: "natural",     // off | natural | custom
  minMs: 800,
  maxMs: 2500
}
```

---

## Typing Indicators - הסוכן "מקליד"

```json
agents.defaults.typingMode: "message"
```

| מצב | מתי מופיע |
|-----|----------|
| `never` | אף פעם |
| `message` | כשמתחיל לכתוב טקסט |
| `thinking` | כשמתחיל להסיק |
| `instant` | מייד כשמתחיל run |

**הערה:** Heartbeats לעולם לא מציגים typing.

---

## Retry - ניסיונות חוזרים

כששליחת הודעה נכשלת, OpenClaw מנסה שוב:

- **ניסיונות:** 3 (ברירת מחדל)
- **Telegram:** מנסה שוב על 429, timeout, ריסט חיבור
- **Discord:** מנסה שוב רק על 429 (rate limit)
- **Backoff:** exponential עם jitter של 10%

Markdown parse errors ב-Telegram → נשלח plain text (לא מנסה שוב).

---

## Markdown Formatting - עיצוב בין ערוצים

כל ערוץ מבין פורמט שונה. OpenClaw ממיר:

```
Markdown → IR (Intermediate Representation) → פורמט ספציפי לערוץ
```

| ערוץ | פורמט |
|-----|-------|
| Telegram | HTML (`<b>`, `<i>`, `<code>`, `<a href>`) |
| Slack | mrkdwn (`*bold*`, `_italic_`) |
| Signal | plain text + style ranges |
| WhatsApp | plain text |
| Discord | own formatting |

**Inline formatting לעולם לא נחתך** בפיצול chunk.
