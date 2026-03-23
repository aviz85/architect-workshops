# עקרונות יסוד: Heartbeat, Cron, ואוטומציה פרואקטיבית

**Sources:**
- https://aimaker.substack.com/p/openclaw-review-setup-guide ⭐⭐⭐⭐⭐
- https://aimlapi.com/blog/openclaw-review-real-world-use-setup-on-a-5-vps-and-what-actually-works ⭐⭐⭐⭐⭐
- https://www.sitepoint.com/openclaw-production-lessons-4-weeks-self-hosted-ai/ ⭐⭐⭐⭐⭐
- https://sidsaladi.substack.com/p/openclaw-use-cases-35-real-ways-people ⭐⭐⭐⭐
- https://milvus.io/ai-quick-reference/what-is-the-openclawmoltbotclawdbot-heartbeat-feature ⭐⭐⭐⭐

---

## מה ה-Heartbeat?

> "Heartbeat thinks about whether something matters right now — unlike cron jobs that run blindly."

ה-Heartbeat הוא ה-"לב הפועם" של OpenClaw — מנגנון monitoring רציף שפועל ב-background.

**הבדל מ-cron**:
- **cron**: מריץ כל X דקות, ללא context
- **Heartbeat**: מריץ, **מחליט** אם הממצא חשוב, **רק אז** שולח הודעה

---

## HEARTBEAT.md - הפורמט

```markdown
# Heartbeat Protocol

## Every 30 minutes — check ONE of these (rotate):
- [ ] Email: any urgent messages from VIPs?
- [ ] Calendar: upcoming meeting in next 2 hours?
- [ ] Tasks: any blocked items >24h?
- [ ] Git: any failed builds on main?

## Only notify me if:
- Email: Priority sender OR keyword "urgent"/"ASAP"/"blocked"
- Calendar: event in <60 minutes I haven't acknowledged
- Tasks: item stuck >24 hours
- Git: build failure on production branch

## Quiet hours: 23:00–08:00 (no notifications unless P0)

## Format: HEARTBEAT_OK if nothing found
```

---

## Rotating Heartbeat Pattern (critical optimization)

**הבעיה הנפוצה**: כל heartbeat מריץ את כל הבדיקות — 4 API calls כל 30 דקות = 192 calls/יום.

**הפתרון**:
```json
// heartbeat-state.json
{
  "checks": {
    "email": "2026-03-24T08:30:00",
    "calendar": "2026-03-24T07:00:00",
    "tasks": "2026-03-24T09:00:00",
    "git": "2026-03-24T10:00:00"
  }
}
```
כל heartbeat: מה הכי ישן? בצע רק אותו. עדכן timestamp.
**תוצאה**: 4 checks ב-2 שעות, לא 4 checks כל 30 דקות.

---

## 5 Use Cases שבאמת עובדים (מ-review מ-$5 VPS)

### 1. Morning Health Summary
Recovery score, HRV, sleep, strain — בקובץ אחד לפני שמציצים בטלפון.
> "The absence of this after habitual use becomes painfully obvious."

### 2. Workout Scheduling
ה-memory layer מזכיר training agreements, מנהל adjustments ב-שיחה. "מאיר כושר" שזוכר.

### 3. Sports Alerts
Pre-match summaries → live score pings → post-match digest. עדיף מכל sports app.

### 4. Contextual Task Reminders
Reminders שיודעים על לוח השנה + שיחות אחרונות + priorities = תחושה אחרת לחלוטין.

### 5. "Mentor Mode" — Pattern Recognition Over Time
**הסוכן ה-killer feature שאנשים לא מצפים לו**:
שתף החלטות ומאמצי habit-building. אחרי שבועות, הסוכן מחזיר patterns: "אמרת שתתאמן 3x/שבוע — ב-3 שבועות האחרונים עשית 1x."
= מערכת accountability שיודעת את ה-history שלך.

---

## Use Case Deep-Dive: Morning Briefing

**הפופולרי ביותר**:
```
Every morning at 7:00 AM:
- Weather for today
- First 3 calendar events
- 3 top headlines (RSS feeds I trust)
- 3 open tasks from Todoist
- One priority item flagged by agent
- Keep under 200 words → Telegram
```

**Advanced version**:
- Garmin/Apple Health data
- GitHub activity summary
- Trending from HN/GitHub Trending
- Market brief (if relevant)

**Setup time**: 30 דקות. **Cognitive benefit**: immediate — מחליף 5-6 app opens.

---

## Use Case Deep-Dive: Voice Note → Daily Journal

```
Throughout day: Send 20-second voice notes to Telegram
Night (9-10 PM): Agent compiles all into structured journal
Output: memory/YYYY-MM-DD.md
Content: mood check, highlights, lessons, next-day focus
```

**Tech**: ffmpeg + Whisper (local via Ollama or OpenAI API)
**Zero friction**: 20 שניות ל-voice note vs. typing journal = adoption מאוד גבוה.

---

## Use Case Deep-Dive: Email Processing

```
Schedule: 7 AM daily, filter last 24h unread
↓
LLM analysis:
- Urgent: notify immediately
- Important: add to morning digest with draft reply
- Newsletter/noise: archive or unsubscribe suggestion
- VIP sender: ping immediately regardless

Output: Daily digest to Telegram by 7:30 AM
```

**Critical rule in SOUL.md**:
`"Draft replies but NEVER send without approval (unless explicitly authorized)"`

---

## Use Case Deep-Dive: Second Brain

```
Any time: Send note/link/idea to Telegram → stored in MEMORY.md
Later: "what did I think about X?" → memory_search → finds it

Advanced:
- mem0 integration for vector-powered semantic search
- Topic-based retrieval: "everything I saved about marketing funnels"
```

**ה-aha moment**: "Notes that lay unread for years suddenly became alive and actionable."

---

## Cron vs. Heartbeat vs. LLM — מתי מה?

| Task | מה להשתמש | למה |
|------|-----------|-----|
| Email monitoring כל 15' | cron + script + conditional LLM | Deterministic filtering, save tokens |
| Calendar alerts | cron + conditional LLM | Reliable, not probabilistic |
| "Is this email urgent?" | LLM | Judgment needed |
| Morning briefing | cron + LLM | Fixed schedule, LLM for formatting |
| Health data analysis | cron + LLM | Fixed schedule, LLM for insight |
| "Should I notify user?" | Heartbeat (LLM decides) | Context-aware judgment |

**עיקרון**:
> "Let LLMs handle judgment. Let scripts handle structured computation and scheduling."

---

## Cost Traps לגבי Heartbeat

**הסכנה**: Heartbeat ב-30 דקות × GPT-4o = **surprise bill**

```
30min heartbeat = 48 calls/day
= 1,440 calls/month
× average tokens per call
= $$$ מחוץ לציפיות
```

**פתרון**:
1. Rotating heartbeat (כנ"ל — בצע רק בדיקה אחת לפולס)
2. Cheap model לheartbeat (Gemini Flash, Haiku) — לא צריך Opus לבדיקת אימייל
3. `reserveTokensFloor: 40000` — ראה memory management
4. **Billing alerts** — set בcloud provider לפני הכל

---

## Heartbeat State Tracking (Todoist pattern)

```markdown
# HEARTBEAT.md - Task Tracking

When work begins: create task in Todoist
Throughout: update status
Flag: items stuck >24h (no activity)
Escalate: items needing human intervention

At every heartbeat:
- What's stuck? → notify user
- What needs decision? → notify user
- What completed? → summarize
```

---

## ציטוטים מ-Production

> "The system runs while you sleep — you wake up to results, not to-do lists."

> "Proactive work the agent can do without asking: documentation updates, repo checks, MEMORY.md maintenance reviewing daily files for distilled insights."

> "Heartbeat is the difference between an AI that answers questions and an AI that manages your life."
