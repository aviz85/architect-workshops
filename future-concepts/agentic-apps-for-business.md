# Agentic Apps לעסקים - Workshop Concept

> **Status:** Concept - ready for scheduling when timing is right
> **Last Updated:** 2026-01-08

---

## The Big Idea

**The Agent IS the Engine.**

In classic applications, we write algorithms, conditionals, and logic to make decisions. In Agentic Apps, **written documents replace algorithms** - protocols, guidelines, and rules that the agent follows. The agent becomes the runtime that executes the "app".

### Classic App vs Agentic App

| Layer | Classic App | Agentic App |
|-------|-------------|-------------|
| **Runtime/Interpreter** | Node.js, Python, JVM | **Claude Code Agent** |
| **Logic** | Algorithms, if/else, loops | **Skills, Commands, Agents, Rules** |
| **Database** | PostgreSQL, MongoDB, Redis | **Project docs (markdown files)** |
| **UI** | React, Vue, HTML/CSS | **Chat** (or wrapped UI) |

### The Key Insight

```
Classic App:  Button Click → Call Function → Execute Code → Update DB
Agentic App:  Button Click → Send /command → Agent Decides → Update Docs
```

When you wrap an Agentic App with UI:
- Every **button** sends a **slash command**
- Every **form submit** triggers an **agent workflow**
- Every **dashboard** reads from **markdown files**
- The UI is just a **skin** - the agent is the brain

### Extended Comparison

| Aspect | Classic App | Agentic App |
|--------|-------------|-------------|
| **Config** | config.yaml, .env | CLAUDE.md |
| **Libraries** | npm, pip packages | Skills |
| **API Endpoints** | REST routes | /commands |
| **Background Jobs** | Cron, queues | Sub-agents |
| **Deployment** | Docker, K8s, CI/CD | `cd folder` |
| **Build Time** | Weeks to months | Hours to days |

---

## Why This Matters for Businesses

### 1. Speed to Market
- Build a complete internal tool in **hours, not weeks**
- No developers needed for prototypes
- Iterate based on feedback instantly

### 2. Living Documentation
- The "code" IS the documentation (CLAUDE.md, Skills)
- Non-technical team members can read and understand the system
- Changes are immediately understandable

### 3. Zero Infrastructure
- No servers to manage
- No databases to maintain
- No deployment pipelines
- Git-friendly state (markdown files)

### 4. UI When Needed
- Start without UI (chat/terminal interaction)
- Add custom UI with **Agent SDK** when ready
- **Buttons → /commands** (no function calls)
- **Forms → agent workflows**
- **Dashboards → read markdown files**
- Agent handles all backend logic

### 5. Automations Layer
- **Hooks** for event-driven triggers (file saved, command run)
- **MCP Servers** for external integrations (Google, Slack, APIs)
- Connect to existing business tools without code

---

## Workshop Overview

### Title (Hebrew)
**Agentic Apps: בניית אפליקציות שלמות ללא קוד מסורתי**

### Subtitle
איך להפוך את Claude Code לפלטפורמת פיתוח לעסק שלך

### Target Audience
- בעלי עסקים שרוצים לבנות כלים פנימיים
- מנהלי פרויקטים שרוצים אוטומציה חכמה
- מפתחים שרוצים להאיץ פיתוח פנימי
- יזמים שרוצים MVP מהיר

### Prerequisites
- היכרות בסיסית עם Claude Code
- הבנה של מושגים בסיסיים (Skills, Commands)
- לא נדרש ידע בתכנות מסורתי

### Duration
3 hours (with break)

---

## Agenda

### Part 1: The Paradigm Shift (45 min)

#### 1.1 מה זה Agentic App? (15 min)
- ההבדל בין אפליקציה קלאסית לאפליקציה אג'נטית
- The Agent IS the Runtime
- Demo: מערכת ניהול משימות בנויה מ-Claude Code primitives

#### 1.2 The Building Blocks (30 min)
| Primitive | תפקיד | אנלוגיה |
|-----------|-------|---------|
| CLAUDE.md | חוקה + הגדרות | config + README |
| Skills | יכולות אוטומטיות | ספריות, middleware |
| Commands | פעולות מפורשות | API endpoints |
| Agents | תהליכים מורכבים | background workers |
| Data Files | מצב האפליקציה | database |

### Part 2: Building Your First Agentic App (60 min)

#### 2.1 Live Build: CRM פשוט לעסק קטן (60 min)
נבנה ביחד מערכת CRM עם:
- ניהול לקוחות (data files)
- הוספת לקוח חדש (/add-customer command)
- מעקב אחרי שיחות (/log-interaction command)
- תזכורות follow-up (agent)
- ניתוח לקוחות (skill)

**Structure:**
```
my-crm/
├── CLAUDE.md           # הגדרת המערכת והחוקים
├── .claude/
│   ├── commands/       # פקודות משתמש
│   │   ├── add-customer.md
│   │   ├── log-interaction.md
│   │   └── followup.md
│   ├── skills/         # יכולות אוטומטיות
│   │   └── customer-analysis/
│   └── agents/         # תהליכים מורכבים
│       └── weekly-review.md
└── data/
    ├── customers/      # תיקיות לקוחות
    └── interactions.md # לוג אינטראקציות
```

### Break (15 min)

### Part 3: Adding UI with Agent SDK (45 min)

#### 3.1 מתי צריך UI? (10 min)
- CLI מספיק לרוב המקרים
- UI כשצריך לשתף עם משתמשים לא טכניים
- UI לדשבורדים ודוחות

#### 3.2 Agent SDK Basics (35 min)
- Python/TypeScript SDK
- חיבור ל-Claude Code primitives
- Demo: Web UI פשוט ל-CRM

```python
# Conceptual example
from claude_agent_sdk import query

async def add_customer(name, email):
    result = await query(
        prompt=f"/add-customer {name} {email}",
        options={"working_directory": "./my-crm"}
    )
    return result
```

### Part 4: Real-World Examples (15 min)

#### 4.1 דוגמאות מהשטח
1. **מערכת ניהול משימות (GTD)** - tasks folder
2. **מערכת workshop management** - architect-workshops
3. **בוט שירות לקוחות**
4. **מערכת ניהול מלאי**

#### 4.2 When NOT to Use Agentic Apps
- מערכות עם דרישות real-time קשיחות
- מערכות עם מיליוני רשומות
- מערכות עם דרישות compliance מחמירות

---

## Key Takeaways

1. **The Agent is the Engine** - הסוכן מחליף את הלוגיקה התכנותית
2. **Documents Replace Algorithms** - מסמכים כתובים במקום קוד
3. **Speed Over Perfection** - עדיף MVP מהיר שאפשר לשפר
4. **Human-Readable State** - כל המידע קריא ונגיש
5. **Composable Architecture** - רכיבים שמשתלבים בקלות

---

## POC Ideas for Demo

### Option A: CRM Mini
- 3 commands: add, log, followup
- 1 skill: customer scoring
- 1 agent: weekly digest

### Option B: Content Calendar
- Track content ideas
- Schedule posts
- Auto-generate drafts

### Option C: Meeting Notes System
- Capture meeting notes
- Extract action items
- Send follow-ups

---

## Marketing Angle

### Hook (Hebrew)
**"בנה אפליקציה שלמה ב-60 דקות - בלי לכתוב שורת קוד"**

### Pain Points
- פיתוח אפליקציות יקר ואיטי
- כלים פנימיים נשארים ברשימת ה-TODO לנצח
- צריך מפתחים לכל דבר קטן

### Promise
- בנה כלים פנימיים בשעות, לא שבועות
- שליטה מלאה בלי תלות במפתחים
- אפליקציות שהצוות יכול להבין ולשנות

---

## Prerequisites Workshop

This workshop assumes familiarity with Claude Code basics. Consider creating a prerequisite workshop:
- **Claude Code למתחילים** (already in ideas list)
- Or provide pre-workshop materials

---

## Notes

- This is a natural evolution of the Claude Code workshops
- Target audience is business-oriented, not developer-oriented
- Focus on practical ROI, not technical elegance
- The "tasks" folder is the perfect show-and-tell example

---

## Related Concepts

- **Low-Code/No-Code** - but with AI intelligence
- **Internal Tools** (Retool, Notion) - but more flexible
- **Automation** (Zapier, Make) - but with reasoning capability

---

> Created as part of future-concepts planning. Move to workshops/ when ready to schedule.
