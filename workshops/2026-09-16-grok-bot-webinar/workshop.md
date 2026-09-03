<div dir="rtl">

# גרוק בוט — סוכן מהעתיד (וובינר, שעה)

> לא צ'אט. לא כלי. **עובד.** לכל בוט מחשב משלו בענן, סיסמאות משלו, זיכרון משלו — והוא ממשיך לעבוד גם כשסגרת את הלפטופ.

</div>

## Logistics

| Field | Value |
|-------|-------|
| **Title** | גרוק בוט — סוכן מהעתיד |
| **Format** | Webinar, 1 hour |
| **Session** | 1 of 2 — repeated one week later on 2026-09-23 |
| **Date** | 2026-09-16 |
| **Day** | Wednesday (verified with `date`) |
| **Time** | 21:00 |
| **Duration** | 1 hour (21:00–22:00) |
| **Platform** | Zoom |
| **Language** | Hebrew, RTL |
| **Price** | ₪100 per participant |
| **Zoom Link** | https://us06web.zoom.us/j/89763444555?pwd=7ZQivzBGGbaAhbgZbvgupkfbpBfR5N.1 |
| **Zoom Meeting ID** | 897 6344 4555 |
| **Zoom Password** | 479791 |
| **Calendar** | Google Calendar event with Zoom link (created 2026-09-02) |
| **Status** | 🔧 Scheduled — Zoom + calendar done, content angle set 2026-09-03, marketing not started |

### WhatsApp Group

| Field | Value |
|-------|-------|
| **WhatsApp Group Link** | [TBD] |
| **Green API Group ID** | [TBD] |

---

## The Angle (set by Aviz, 2026-09-03)

**גרוק בוט, סוכן מהעתיד.** The webinar answers five questions, in this order:

1. **מה זה גרוק בוט** — what it actually is, in one picture
2. **מה כל כך עתידני בו** — what is genuinely new here vs. every agent we already know
3. **טריקים שהופכים אותו ליעיל במיוחד** — the patterns that make it work well
4. **איך לא לגמור את כל הטוקנים בשעתיים** — the cost discipline
5. **איפה הוא מביא את התועלת האיכותית ביותר בעבודה** — where to point it first

Research backing each pillar: see `research.md` in this folder (facts, sources, official vs. user-reported).
Full 2-hour background plan: `workshops/2026-08-23-grok-bot/workshop.md`.

**Timing hook:** launched August 11, 2026. Still the first Hebrew deep-dive. "יצא לפני חודש — בואו נבדוק ביחד."

---

## Overview

<div dir="rtl">

כל מי שעובד עם AI מכיר את התקרה: הסוכן מגיע ל-90% ואז נעצר, כי הוא יושב בתוך חלון צ'אט על המחשב שלך.
גרוק בוט הוא הצצה לדור הבא: כל בוט מקבל **מחשב משלו בענן**, זהות משלו, זיכרון משלו, ורץ תמיד — גם כשאתה ישן.

בשעה אחת נענה על חמש שאלות: מה זה בכלל, מה כל כך עתידני בו, אילו טריקים הופכים אותו ליעיל במיוחד,
איך לא לשרוף את כל הטוקנים בשעתיים הראשונות, ואיפה בעבודה שלך הוא מביא את התועלת הכי איכותית.

</div>

---

## Core Thesis

The bottleneck was never intelligence. It was **environment**. An agent with its own computer, its own
logins, its own memory and an always-on runtime can actually finish the swing — the work lands in the real tool.

"סוכן מהעתיד" is not hype. It is the first product where four things we used to build by hand (see the fleet,
OpenClaw, tmux agents) come in the box:

| What we build by hand today | Grok Bot in the box |
|---|---|
| A VPS + tmux + Claude Code per agent | A cloud computer per bot, one click |
| CLAUDE.md + knowledge files | Persistent per-bot memory that learns your voice and edge cases |
| Skills written as text | `Teach a task` — record once, the bot repeats it |
| Cron + scripts | Routines the bot builds for itself |
| Telegram bridge + prefixes to route to agents | Group chats between bots, a chief-of-staff bot that routes |

**The promise:** אתה נכנס עם סוכן אחד בצ'אט. אתה יוצא עם מודל מנטלי של עובד מהעתיד — ועם משמעת של מנהל.

---

## Target Audience

- Anyone using AI seriously (Claude Code, Cursor, ChatGPT) who keeps hitting the "90% done" wall
- Business owners who want work to land **inside the tool**, not inside a chat transcript
- Curious about the newest agent product and whether it is worth $200–300/month
- **No coding required**

---

## Agenda (21:00–22:00)

<div dir="rtl">

### 1. מה זה גרוק בוט (21:00–21:08)

- מה xAI שיחררו ב-11 באוגוסט, ולמה זה לא עוד צ'אט
- ההבדל בין 90% ל-100%: איפה כל סוכן שהכרתם נעצר
- תמונה אחת: בוט = מחשב בענן + זהות + זיכרון + רץ תמיד

### 2. מה כל כך עתידני בו (21:08–21:20)

- מחשב משלו: דפדפן, קבצים, טרמינל, לוגינים — עובד גם על אתרים בלי API
- זהות ותפקיד במקום משימה: "אתה אחראי על תחום X", לא "תסכם לי"
- זיכרון מתמשך: לומד את הקול שלך, את מקרי הקצה, ומתי לפנות אליך
- צוות: כמה בוטים, קבוצת צ'אט ביניהם, בוט מנהל
- השוואה קצרה: מה שבנינו ביד (צי, OpenClaw, tmux) מגיע כאן בקופסה

### 3. דמו חי + טריקים שהופכים אותו ליעיל במיוחד (21:20–21:35) ⭐

- בוט חי על המסך: תפקיד, אינטגרציה אחת, משימה ראשונה
- טריק א: איך כותבים בריף לבוט (תפקיד, גבולות, מתי לשאול)
- טריק ב: `Teach a task` — מקליטים פעם אחת במקום להסביר עשר פעמים
- טריק ג: רוטינות — הבוט בונה לעצמו בדיקה מחזורית
- טריק ד: מסירת ההגה — הבוט מגיע למסך התחברות ומחזיר לך שליטה לרגע

### 4. איך לא לגמור את כל הטוקנים בשעתיים (21:35–21:45)

- איך גרוק בוט מודד שימוש, ומה באמת שורף את המכסה
- הטעויות שכולם עושים ביום הראשון (בוט שמסתובב בדפדפן בלי גבול, תפקיד מעורפל, כמה בוטים בבת אחת)
- משמעת של מנהל: משימות מוגדרות, נקודות עצירה, בדיקה לפני הרחבה
- מה עולה כמה: התוכניות, ומה מקבלים בכל אחת

### 5. איפה הוא מביא את התועלת האיכותית ביותר בעבודה (21:45–21:55)

- לא "מה הוא יכול" אלא "איפה כדאי להתחיל": מייל, CRM, מעקב אחרי מקורות, דוחות, אתרים בלי API
- מבחן ההתאמה: תהליך חוזר + מערכות קיימות + החלטות קטנות = הבוט הראשון שלך
- מה לא לתת לו (עדיין): החלטות בלתי הפיכות, כסף, לקוחות בלי בקרה

### 6. שאלות (21:55–22:00)

- המגבלות הכנות: אין בחירת מודל, בטא, מחיר, אנדרואיד עוד לא, אבטחה של לוגינים
- מה אפשר לעשות **מחר בבוקר** גם בלי לשלם: העקרונות עוברים לכל כלי סוכני

</div>

### Flow Summary

| Time | Block | Deliverable for the participant |
|------|-------|--------------------------------|
| 21:00–21:08 | What it is | One clear picture of the product |
| 21:08–21:20 | What is futuristic | Understands "agent = its environment" and what is new |
| 21:20–21:35 | Demo + tricks ⭐ | Sees a bot built, and leaves with 4 concrete patterns |
| 21:35–21:45 | Token discipline | Knows how usage is metered and how to not burn it |
| 21:45–21:55 | Highest-value work | Can pick their own first bot |
| 21:55–22:00 | Q&A | Knows the real cost and the real limits |

---

## POC / Demo Plan

One hour means **one primary demo, pre-built and rehearsed**, no live setup from zero.

| Priority | Demo | Notes |
|---|---|---|
| Primary | `Teach a task` recording of a real flow, then the bot repeats it | Strongest no-code moment; record before the session, replay live |
| Backup | Bot triages Gmail and summarizes | Relatable, low risk |
| Stretch | Two bots in a group chat handing work to each other | Only if time allows in block 2 |

---

## Open Decisions (Aviz)

- [ ] **Access:** which subscription do we demo on — SuperGrok Heavy, Cursor Ultra, or trial? **Blocking for the demo.**
- [ ] Price confirmed at ₪100?
- [ ] WhatsApp group created (shared between both sessions, or one per session?)
- [ ] Wednesday 21:00 is not one of the usual slots (Mon/Thu) — accepted as-is
- [ ] Avatar — reuse Boss avatar, or new "agent from the future" character with an xAI/Grok accent?

---

## Links

| Description | URL |
|-------------|-----|
| Official announcement (xAI, Aug 11 2026) | https://x.ai/news/introducing-grok-bot |
| Unite.AI launch coverage | https://www.unite.ai/xai-launches-grok-bot-always-on-ai-teammates-with-their-own-cloud-computers/ |
| Hands-on explainer + screenshots | https://www.ayautomate.com/blog/grok-bot-xai-ai-agents-explained |
| Full 2-hour plan (source) | `workshops/2026-08-23-grok-bot/workshop.md` |

---

## Assets

| File | Description |
|------|-------------|
| `research.md` | Sourced facts per pillar (limits, tricks, use cases, what is new) |
| `assets/references/` | Official Grok Bot graphics and UI screenshots, for poster and slides |
| `assets/avatar.jpg` | Workshop character sheet (TBD) |
| `assets/poster.jpg` | Promotional poster (TBD) — one poster can serve both sessions |
| `presentation-plan.md` | Presentation blueprint, Hebrew + RTL (TBD) |
| `assets/slides.pdf` | Final slides (TBD) |

---

## Pipeline

### POC
- [x] Research done (launch, features, pricing, limits)
- [x] Reference graphics collected
- [ ] Subscription access secured
- [ ] Primary demo pre-built and rehearsed
- [ ] Wow effect confirmed

### Presentation
- [ ] Content outline reviewed
- [ ] `presentation-plan.md` created (Hebrew, RTL)
- [ ] Slides created via NotebookLM Studio

### Poster & Marketing
- [ ] Avatar chosen / created
- [ ] Poster created
- [ ] Marketing copy written
- [ ] Facebook groups
- [ ] WhatsApp broadcast + groups
- [ ] Sneak peeks

### Logistics
- [x] Zoom meeting created (2026-09-02)
- [x] Google Calendar event created (2026-09-02)
- [ ] WhatsApp group created

### Delivery
- [ ] Workshop delivered

**Attendance:**

| Metric | Count |
|--------|-------|
| WhatsApp Group Size | |
| First 15 min | |
| Peak | |
| Last 15 min | |

### Post-Workshop
- [ ] Transcript added
- [ ] Summary written
- [ ] Testimonials collected
- [ ] Follow-up sent

---

## Notes

- Two weeks of marketing runway (created 2026-09-02). First push should go out by 9.9.
- 16.9 sits between Rosh Hashanah (12–13.9) and Yom Kippur (21.9) — a regular working week.
- Paid-only access is the biggest content risk: frame as "understand the model + watch it work + take the principles anywhere", not "install it with me".
