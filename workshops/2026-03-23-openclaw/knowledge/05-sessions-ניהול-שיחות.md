# פרק 5: Sessions - ניהול שיחות

## מה זה Session?

**Session** הוא ה"שיחה" של הסוכן עם משתמש או קבוצה מסוימת. כל session:
- שומר **היסטוריה** (transcripts) ב-JSONL
- יש לו **session key** ייחודי
- יכול להיאפס, לנוח, לפוג

---

## Session Keys - איך השיחות מזוהות

OpenClaw מזהה כל שיחה על ידי **session key**:

| סוג | Key |
|-----|-----|
| DM פרטי (ברירת מחדל) | `agent:main:main` |
| קבוצה | `agent:main:<channel>:group:<id>` |
| Cron job | `cron:<job.id>` |
| Hook | `hook:<uuid>` |
| Node | `node-<nodeId>` |

---

## DM Scope - בידוד בין משתמשים

**בעיה:** אם כמה אנשים שולחים הודעות לסוכן ב-DM - האם הם חולקים שיחה?

**ברירת מחדל (main):** כל DMs מתמזגים לשיחה אחת! ⚠️ זה **מסוכן** אם יש כמה משתמשים - הם יראו מידע זה על זה.

### אפשרויות DM Scope

```
main                → כולם בשיחה אחת (ברירת מחדל)
per-peer            → כל שולח מבודד (לפי מזהה שולח)
per-channel-peer    → כל שולח×ערוץ מבודד ← מומלץ
per-account-channel-peer → בידוד מלא
```

**המלצה:** השתמשו ב-`per-channel-peer` כשיש כמה משתמשים.

---

## Session Lifecycle - מחזור החיים

### איפוס אוטומטי
- **יומי:** 4:00 בבוקר (על השרת)
- **Idle:** אחרי X דקות של חוסר פעילות (אופציונלי)

### איפוס ידני בצ'אט
```
/new     → שיחה חדשה (מאפס הכל)
/reset   → כמו /new
```

### הגדרות מתקדמות
```json
resetByType: {
  direct: "daily",    // DMs מאופסים יומי
  group: "idle:60"    // קבוצות אחרי 60 דקות דממה
}
```

---

## שמירת Sessions

**מיקום:** `~/.openclaw/agents/<agentId>/sessions/`

```
sessions/
├── sessions.json         ← מטה-דאטה של כל ה-sessions
└── <SessionId>.jsonl     ← היסטוריה מלאה של כל שיחה
```

**JSONL** = JSON Lines - כל שורה היא אובייקט JSON נפרד (יעיל לאחסון).

### ניהול ושמירת מקום

```bash
openclaw sessions cleanup --dry-run   # בדוק מה יימחק
openclaw sessions cleanup --enforce   # מחק ישנים
```

**הגדרות ברירת מחדל:**
- `pruneAfter: 30d` - מחק אחרי 30 יום
- `maxEntries: 500` - מקסימום 500 sessions
- `maxDiskBytes` - תקציב דיסק (אופציונלי)

---

## Send Policy - בקרת שליחה

ניתן **לחסום שליחת תשובות** בסוגי session מסוימים:
```
/send on      → שלח
/send off     → אל תשלח
/send inherit → קח מהגדרה הכללית
```

---

## פקודות בדיקה

```
/status          → מצב ה-session הנוכחי
/context list    → מה מוזרק
/stop            → עצור ריצה פעילה
```

```bash
# CLI
openclaw status
openclaw sessions --json
```

---

## Session Tools - כלים שהסוכן יכול להשתמש

הסוכן יכול **לתקשר עם sessions אחרים** שלו דרך כלים:

### sessions_list
```
→ מחזיר: רשימת sessions פעילים
```

### sessions_history
```
params: { sessionKey: "main" }
→ מחזיר: transcript של session
```

### sessions_send
```
params: { sessionKey: "group:123", message: "עדכון: המשימה הושלמה" }
→ שולח הודעה ל-session אחר
```

### sessions_spawn ⭐ חדשני
```
params: { task: "...", runtime: "subagent" }
→ מרחיל סוכן-משנה מבודד
```

**Ping-Pong:** אחרי `sessions_send`, OpenClaw מאפשר עד 5 סבבי תשובה-שאלה בין sessions.

כדי לעצור: הסוכן המקבל מגיב `REPLY_SKIP`.

---

## Presence - מי מחובר?

OpenClaw שומר רשימה קלה של כל הclients המחוברים:
- Gateway עצמו
- כל Client (Web, CLI, macOS App)
- כל Node (iOS, Android)

**TTL:** ערכים פגים אחרי 5 דקות. מקסימום 200 ערכים.
