# ידע OpenClaw - תרגום והסבר בעברית

תיקייה זו מכילה הסברים בעברית של תיעוד OpenClaw הרשמי.
מבוסס על: https://docs.openclaw.ai/concepts/

---

## פרקים

| קובץ | נושא | תוכן עיקרי |
|------|------|------------|
| [01 - מבוא ותכונות](01-מבוא-ותכונות.md) | **מה זה OpenClaw?** | תכונות, למה לא Claude.ai רגיל |
| [02 - ארכיטקטורה](02-ארכיטקטורה-איך-זה-עובד.md) | **המבנה הפנימי** | Gateway, WebSocket, Nodes, Canvas |
| [03 - הסוכן ו-Workspace](03-הסוכן-workspace-וזיכרון.md) | **הבית של הסוכן** | קבצי Bootstrap, זיכרון, Agent Loop |
| [04 - קונטקסט](04-קונטקסט-וחלון-ההקשר.md) | **חלון ההקשר** | Compaction, Pruning, System Prompt |
| [05 - Sessions](05-sessions-ניהול-שיחות.md) | **ניהול שיחות** | Session Keys, DM Scope, Lifecycle |
| [06 - הודעות ו-Streaming](06-הודעות-תורים-וstreaming.md) | **זרימת הודעות** | Queue, Debounce, Streaming, Retry |
| [07 - מודלים](07-מודלים-וספקים.md) | **ספקי AI** | Failover, OAuth, Usage Tracking |
| [08 - ריבוי סוכנים](08-ריבוי-סוכנים-ו-routing.md) | **Multi-Agent** | Routing, Sub-Agents, Delegate |

---

## נושאים מקור (28 עמודים)

features, architecture, agent, agent-loop, agent-workspace, compaction, context, context-engine, delegate-architecture, markdown-formatting, memory, messages, model-failover, model-providers, models, multi-agent, oauth, presence, queue, retry, session, session-pruning, session-tool, streaming, system-prompt, timezone, typing-indicators, usage-tracking

---

## מקרא מהיר

| מונח | הסבר |
|------|-------|
| **Gateway** | ה"שרת" המרכזי שמחבר כל הערוצים |
| **Agent** | הסוכן AI עם workspace ו-sessions |
| **Session** | שיחה ספציפית עם משתמש/קבוצה |
| **Workspace** | תיקיית הבית של הסוכן (AGENTS.md, SOUL.md...) |
| **Compaction** | כיווץ היסטוריה כשהקונטקסט מתמלא |
| **Skill** | מיומנות שמוסיפים לסוכן (markdown file) |
| **Node** | מכשיר (iOS/Android) שמחובר ל-Gateway |
| **Canvas** | עמוד HTML/CSS שהסוכן יכול לערוך |
| **Routing** | כלל שמחליט איזה סוכן מקבל הודעה |
| **Sub-Agent** | סוכן-ילד שנוצר למשימה ספציפית |
