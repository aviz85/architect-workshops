<div dir="rtl">

# גרוק בוט — צוות הסוכנים הראשון שלך (וובינר, שעה)

> לא צ'אט. לא כלי. **עובדים.** לכל בוט מחשב משלו בענן, סיסמאות משלו, והוא ממשיך לעבוד גם כשסגרת את הלפטופ.

</div>

## Logistics

| Field | Value |
|-------|-------|
| **Title** | גרוק בוט — צוות הסוכנים הראשון שלך |
| **Format** | Webinar, 1 hour (compact version of the 2-hour workshop) |
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
| **Calendar** | Event created 2026-09-02 (Google Calendar, with Zoom link) |
| **Status** | 🔧 Scheduled — Zoom + calendar done, marketing not started |

### WhatsApp Group

| Field | Value |
|-------|-------|
| **WhatsApp Group Link** | [TBD] |
| **Green API Group ID** | [TBD] |

---

## Origin

This is the rescheduled, compacted version of `workshops/2026-08-23-grok-bot/` (2-hour plan, never delivered).
Full research, thesis, demo candidates and links live there. This file holds only what changed for the 1-hour format.

**Timing hook still holds:** Grok Bot launched on August 11, 2026 — about five weeks before this session.
Still the first Hebrew deep-dive. Angle: "יצא לפני חודש — בואו נבדוק ביחד אם זה באמת עובד."

---

## Overview

<div dir="rtl">

כל מי שעובד עם AI מכיר את התקרה: הסוכן מגיע ל-90% ואז נעצר, כי הוא יושב בתוך חלון צ'אט על המחשב שלך.
גרוק בוט נותן לכל בוט **מחשב משלו בענן** — דפדפן אמיתי, קבצים, טרמינל, וחיבורים משלו לכלים שאתה עובד איתם.

בשעה אחת: נבין את המודל, נראה בוט ראשון נבנה חי על המסך, נלמד אותו תהליך בהדגמה אחת (בלי קוד),
ונראה מה קורה כשמפעילים כמה בוטים במקביל. ובאותה נשימה — מה לא עובד: המחיר, היעדר בחירת מודל, והסיכון.

</div>

---

## Core Thesis

The bottleneck was never intelligence. It was **environment**. An agent with its own computer, its own
logins and an always-on runtime can actually finish the swing — the work lands in the real tool.

| Aviz's framework | Grok Bot's version of it |
|---|---|
| **חצי-אוטומאט** | Message a bot like a colleague, it pings you only for judgment calls |
| **Single Player → Multi Player** | Multiple bots, group chats, a "chief of staff" bot managing specialists |
| **לסגור לופ** | "Teach a task" recording + routines = the improve step, without code |
| **קונטקסט > אינטליגנציה** | Persistent memory per bot: learns your voice, edge cases, when to ping you |

---

## Target Audience

- Anyone using AI seriously (Claude Code, Cursor, ChatGPT) who keeps hitting the "90% done" wall
- Business owners who want work to land **inside the tool**, not inside a chat transcript
- Curious about the newest agent product and whether it is worth $200–300/month
- **No coding required**

---

## Agenda (21:00–22:00)

<div dir="rtl">

### 1. פתיחה — מה קרה ב-11 באוגוסט (21:00–21:08)

- xAI שיחררו גרוק בוט. למה זה לא עוד צ'אט
- ההבדל בין 90% ל-100%: איפה כל סוכן שהכרתם נעצר
- הכלל: **סוכן שווה בדיוק כמו הסביבה שנתת לו**

### 2. המודל — סוכן עם מחשב משלו (21:08–21:20)

- מה מקבל כל בוט: מחשב בענן, דפדפן, קבצים, טרמינל, לוגינים משלו
- למה זה עובד גם על אתרים בלי API
- מודל האמון: הבוט מגיע למסך התחברות ומחזיר לך את ההגה לרגע
- תפקיד במקום משימה: "אתה אחראי על תחום X"

### 3. דמו חי — בונים בוט ראשון + מלמדים אותו תהליך (21:20–21:40) ⭐

- מתארים בשפה חופשית מה צריך — הבוט שואל, מציע תוכנית, מתחיל לעבוד
- מחברים אינטגרציה אחת אמיתית (Gmail / Notion / Drive)
- `Teach a task` — מקליטים תהליך פעם אחת, הבוט חוזר עליו. זה ה"סקיל" של מי שלא כותב קוד
- רוטינה: אותו תהליך על לוח זמנים, בלי שתבקש

### 4. צוות בוטים — מ-Single Player ל-Multi Player (21:40–21:50)

- כמה בוטים במקביל, כל אחד עם לֵיין: מייל, הוצאות, גיוס, תפעול
- בוט `chief of staff` שמנהל את השאר ומושך אותך רק להחלטות

### 5. הצד השני של המטבע + Q&A (21:50–22:00)

- **המחיר:** אין חינמי. SuperGrok Heavy (~$300/חודש), Cursor Ultra ($200), Cursor Teams Premium ($120 למשתמש)
- **אין בחירת מודל**, אין קול חי, אנדרואיד עוד לא, וזו בטא
- מה אפשר לעשות **מחר בבוקר** גם בלי לשלם: העקרונות עוברים לכל כלי סוכני
- שאלות

</div>

### Flow Summary

| Time | Block | Deliverable for the participant |
|------|-------|--------------------------------|
| 21:00–21:08 | Why now | Understands the 90%→100% gap |
| 21:08–21:20 | The model | Understands "agent = its environment" |
| 21:20–21:40 | Live demo ⭐ | Sees a bot built, connected, and taught a task |
| 21:40–21:50 | Bot team | Has a mental model for Multi Player |
| 21:50–22:00 | Reality check + Q&A | Knows the real cost and the real limits |

---

## POC / Demo Plan

One hour means **one primary demo, pre-built and rehearsed**, no live setup from zero.

| Priority | Demo | Notes |
|---|---|---|
| Primary | `Teach a task` recording of a real flow, then the bot repeats it | Strongest no-code moment; record before the session, replay live |
| Backup | Bot triages Gmail and summarizes | Relatable, low risk |
| Stretch | Two bots in a group chat handing work to each other | Only if time allows in block 4 |

---

## Open Decisions (Aviz)

- [ ] **Access:** which subscription do we demo on — SuperGrok Heavy, Cursor Ultra, or trial? **Blocking for the demo.**
- [ ] Price confirmed at ₪100?
- [ ] WhatsApp group created (shared between both sessions, or one per session?)
- [ ] Wednesday 21:00 is not one of the usual slots (Mon/Thu) — accepted as-is
- [ ] Avatar — reuse Boss avatar, or new character with an xAI/Grok accent?

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
| `assets/avatar.jpg` | Workshop character sheet (TBD) |
| `assets/poster.jpg` | Promotional poster (TBD) — one poster can serve both sessions |
| `presentation-plan.md` | Presentation blueprint, Hebrew + RTL (TBD) |
| `assets/slides.pdf` | Final slides (TBD) |

---

## Pipeline

### POC
- [x] Research done (launch, features, pricing, limits)
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
