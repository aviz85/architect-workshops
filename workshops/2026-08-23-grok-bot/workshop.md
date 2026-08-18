<div dir="rtl">

# גרוק בוט — צוות הסוכנים הראשון שלך

> לא צ'אט. לא כלי. **עובדים.** לכל בוט מחשב משלו בענן, סיסמאות משלו, והוא ממשיך לעבוד גם כשסגרת את הלפטופ.

</div>

## Logistics

| Field | Value |
|-------|-------|
| **Title** | גרוק בוט — צוות הסוכנים הראשון שלך |
| **Date** | 2026-08-23 |
| **Day** | Sunday (verified with `date`) |
| **Time** | 21:00 |
| **Duration** | 2 hours (21:00–23:00) |
| **Platform** | Zoom webinar |
| **Language** | Hebrew, RTL |
| **Price** | ₪100 per participant |
| **Zoom Link** | [TBD] |
| **Status** | 🔧 Just created — content drafted, marketing not started |

### WhatsApp Group

| Field | Value |
|-------|-------|
| **WhatsApp Group Link** | [TBD] |
| **Green API Group ID** | [TBD] |

---

## Why now (the timing hook)

**Grok Bot launched on August 11, 2026** — 12 days before this workshop. This is the freshest tool
on the market, and the workshop is the first Hebrew deep-dive on it. Timing *is* the marketing angle:
"יצא לפני שבועיים — בואו נבדוק ביחד אם זה באמת עובד."

xAI describes it as "your team of always-on agents." It is in early beta, desktop (macOS / Windows /
Linux) + iOS, Android coming soon.

---

## Overview

<div dir="rtl">

כל מי שעובד עם AI מכיר את התקרה: הסוכן מגיע ל-90% ואז נעצר, כי הוא יושב בתוך חלון צ'אט על המחשב שלך.
גרוק בוט שובר את התקרה בצורה הכי פשוטה שיש — הוא נותן לכל בוט **מחשב משלו בענן**: דפדפן אמיתי,
מערכת קבצים, טרמינל, וחיבורים משלו לכלים שאתה עובד איתם. הוא נכנס לתיבת המייל שלך, ל-CRM, לנוטיון,
ולאתרים שאין להם API בכלל — ועובד שם כמו בן אדם.

בסדנה נבין את המודל, נבנה בוט ראשון חי על המסך, נלמד אותו תהליך בהדגמה אחת (בלי לכתוב שורת קוד),
ונראה מה קורה כשמפעילים **כמה בוטים במקביל** עם בוט אחד שמנהל את השאר.

ובאותה נשימה — נדבר גם על מה שלא עובד: המחיר, היעדר בחירת מודל, ולמה "צוות בוטים" זה גם סיכון ולא רק חלום.

</div>

---

## Core Thesis

The bottleneck was never intelligence. It was **environment**.

An agent inside a chat window can only tell you what to do. An agent with its own computer, its own
logins, and its own always-on runtime can actually **finish the swing** — the work lands in the real
tool, where a human would have put it.

This maps exactly onto the Architect method:

| Aviz's framework | Grok Bot's version of it |
|---|---|
| **חצי-אוטומאט** — send a task, go do something else, come back to a result | The core interaction model: message a bot like a colleague, it pings you only for judgment calls |
| **Single Player → Multi Player** | Multi Player out of the box: multiple bots, group chats, a "chief of staff" bot managing specialists |
| **לסגור לופ** (Action → Observe → Judge → Improve) | "Teach a task" recording + routines = the improve step, without code |
| **קונטקסט > אינטליגנציה** | Persistent memory per bot: it learns your voice, your edge cases, when to ping you |

**The promise:** אתה נכנס עם סוכן אחד בצ'אט. אתה יוצא עם מודל מנטלי של צוות.

---

## Target Audience

- Anyone already using AI seriously (Claude Code, Cursor, ChatGPT) who keeps hitting the "90% done" wall
- Business owners who want work to land **inside the tool**, not inside a chat transcript
- People curious about the newest agent product on the market and whether it is worth $200–300/month
- **No coding required** — this is a browser-and-apps tool, not a terminal tool

---

## Agenda (21:00–23:00)

<div dir="rtl">

### 1. פתיחה — מה קרה ב-11 באוגוסט (21:00–21:15)

- xAI שיחררו גרוק בוט. למה זה לא עוד השקה של צ'אט
- ההבדל בין 90% ל-100%: איפה בדיוק כל סוכן שהכרתם נעצר
- הכלל: **סוכן שווה בדיוק כמו הסביבה שנתת לו**

### 2. המודל — סוכן עם מחשב משלו (21:15–21:35)

- מה בדיוק מקבל כל בוט: מחשב בענן, דפדפן, קבצים, טרמינל, לוגינים משלו
- למה זה עובד גם על אתרים בלי API — ~80% מהאינטרנט אין לו MCP או API לקרוא לו
- מודל האמון: הבוט מגיע למסך ההתחברות ומחזיר לך את ההגה לרגע — אתה מתחבר, הוא ממשיך
- תפקיד במקום משימה: לא "תסכם לי את המסמך" אלא "אתה אחראי על תחום ה-X"

### 3. דמו חי — בונים בוט ראשון (21:35–22:05) ⭐

- פותחים אפליקציה, מתארים בשפה חופשית מה צריך — הבוט שואל שאלות, מציע תוכנית, מתחיל לעבוד
- הבוט נותן לעצמו שם ותפקיד
- מחברים אינטגרציה אחת אמיתית (Gmail / Notion / Drive / Slack)
- אנחנו מסתכלים לו על המסך בזמן אמת ולוקחים ממנו שליטה כשצריך

### 4. ללמד בהדגמה + רוטינות (22:05–22:25)

- `Teach a task` — מקליטים את עצמנו עושים תהליך פעם אחת, והבוט לומד לחזור עליו
- זה ה"סקיל" של האנשים שלא כותבים קוד
- רוטינות: אותו תהליך, על לוח זמנים, בלי שתבקש
- דוגמה: "תעקוב אחרי חשבון X ותודיע לי כשיש פוסט חדש" — הבוט בונה לעצמו בדיקה כל 30 דקות

### 5. צוות בוטים — מ-Single Player ל-Multi Player (22:25–22:45)

- כמה בוטים במקביל, כל אחד עם לֵיין: מייל, הוצאות, גיוס, באגים, תפעול
- בוט `chief of staff` שמנהל את השאר
- קבוצת צ'אט של בוטים: הם מעבירים עבודה ביניהם ומושכים אותך רק להחלטות
- למה זה הרגע שבו אתה מפסיק להיות הצוואר בקבוק

### 6. הצד השני של המטבע + Q&A (22:45–23:00)

- **המחיר:** אין גרסה חינמית. הגישה דרך SuperGrok Heavy (~$300/חודש), Cursor Ultra ($200/חודש) או Cursor Teams Premium ($120 למשתמש)
- **אין בחירת מודל** — הכלי בוחר לבד, בלי מצב מתקדם
- אין מצב קולי חי, אנדרואיד עוד לא יצא, וזו בטא
- מה כן אפשר לעשות **מחר בבוקר** גם בלי לשלם: העקרונות עוברים לכל כלי סוכני
- שאלות

</div>

### Flow Summary

| Time | Block | Deliverable for the participant |
|------|-------|--------------------------------|
| 21:00–21:15 | Why now | Understands the 90%→100% gap |
| 21:15–21:35 | The model | Understands "agent = its environment" |
| 21:35–22:05 | Live demo ⭐ | Sees a bot built and connected from zero |
| 22:05–22:25 | Teach + routines | Knows how to train an agent without code |
| 22:25–22:45 | Bot team | Has a mental model for Multi Player |
| 22:45–23:00 | Reality check + Q&A | Knows the real cost and the real limits |

---

## POC / Demo Plan

**The wow moment:** a bot logs into a real site that has no API, does a multi-step job, and reports back
— live, while Aviz talks about something else. Semi-auto on stage.

Candidate demos (pick one primary + one backup):

| # | Demo | Why it lands |
|---|------|-------------|
| 1 | Bot monitors an X account and messages when a new post appears | Simple to state, visibly autonomous, builds its own 30-min routine |
| 2 | Bot triages Gmail and summarizes | Everyone has an inbox; instantly relatable |
| 3 | `Teach a task` recording of a real reporting flow, then bot repeats it | The strongest "no-code skill" moment |
| 4 | Two bots in a group chat handing work to each other | The Multi Player punchline |

---

## Open Decisions (Aviz)

- [ ] **Access:** which subscription do we demo on — SuperGrok Heavy, Cursor Ultra, or a one-time free trial? Nothing here works without it. **Blocking for the demo.**
- [ ] Price confirmed at ₪100?
- [ ] Zoom link + WhatsApp group created
- [ ] Is a Sunday 21:00 slot broadcast-friendly (first Sunday workshop — most have been Mon/Thu)?
- [ ] Avatar for this workshop — reuse Boss avatar, or a new character with an xAI/Grok visual accent?

---

## Links

| Description | URL |
|-------------|-----|
| Official announcement (xAI, Aug 11 2026) | https://x.ai/news/introducing-grok-bot |
| Unite.AI launch coverage | https://www.unite.ai/xai-launches-grok-bot-always-on-ai-teammates-with-their-own-cloud-computers/ |
| Hands-on explainer + screenshots | https://www.ayautomate.com/blog/grok-bot-xai-ai-agents-explained |

---

## Assets

| File | Description |
|------|-------------|
| `assets/avatar.jpg` | Workshop character sheet (TBD) |
| `assets/poster.jpg` | Promotional poster (TBD) |
| `presentation-plan.md` | Presentation blueprint, Hebrew + RTL (TBD) |
| `assets/slides.pdf` | Final slides (TBD) |

---

## Pipeline

### POC
- [x] Research done (launch, features, pricing, limits)
- [ ] Subscription access secured
- [ ] Demo built and rehearsed
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
- [ ] Sneak peeks (the "it launched 12 days ago" angle is time-sensitive — push early)

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

- Marketing runway is short: 4 days from creation to delivery. Poster and first push should go out immediately.
- Sunday is not one of the usual slots (Mon/Thu) — worth watching whether attendance differs.
- The paid-only access is the biggest content risk: participants cannot follow along hands-on. Frame the
  workshop as "understand the model + watch it work + take the principles anywhere", not "install it with me".
