# Workshop Synthesis - "לסגור לופ"

**Workshop date:** 2026-04-30, Thursday, 10:00-12:00
**Price:** ₪100
**Planning date:** 2026-04-23 (one week prior)

This document consolidates every concept, decision, and insight from the planning conversation. It feeds the presentation, marketing, and live demos.

---

## 1. The Core Thesis (evolved through the planning)

### Version 1 (discarded)
> "Claude Code returns as the best agent."

Too tool-centric. Sounds like a product pitch.

### Version 2 (discarded)
> "Closing the loop - the agent must see the result of its action."

Correct but too narrow. Focused on feedback/observation.

### Version 3 (FINAL)
> **"Closing the loop = the agent takes responsibility for the task. An agent that doesn't close a loop is not an employee - it's another manager you hired: yourself."**

This is the teaching core. Not about self-observation only - about **ownership**. A real employee takes a headache off your plate. A half-automated AI **adds** a headache because you still have to keep triggering it.

### The Test (4 questions participants answer live)

For each recent AI interaction, ask:

| Question | Closed loop | Open loop |
|----------|-------------|-----------|
| How soon am I involved again after the request? | Only at the end | Every 2-5 min |
| Who remembers where we left off? | The agent | Me |
| Who checks that it actually worked? | The agent | Me |
| Who knows when to trigger it again? | The agent / system | Me |

**If you are the answer to 3+ → the agent is adding work, not removing it.**

---

## 2. The 5 Tools of Loop Closure (the pedagogical core)

These are the concrete mechanisms. Each gets a live demo in the workshop.

### 1. Plan (`plan mode`)
The agent maps the full path before starting. One approval from you → zero mid-task interruptions.
- **Closes:** the "what now?" loop
- **Demo:** medium task with and without plan mode - time the interruptions

### 2. Tasks (`TaskCreate` / `TaskUpdate`)
The agent keeps its own todo list. You don't remind it what's next.
- **Closes:** the "where were we?" loop
- **Demo:** agent crashes mid-run, restarts, resumes from exact position

### 3. Cron / Scheduled / Routines
The clock becomes the trigger, not you. Daily summary at 8 AM, weekly report Monday, hourly inbox check.
- **Closes:** the "I forgot to run it" loop
- **Demo:** a morning routine running live
- **Note:** Claude Code's new "Routines" (April 2026) makes this first-class

### 4. Hooks
Events become triggers. Before commit → lint. After edit → preview. Email arrives → summarize.
- **Closes:** the "I forgot to check" loop
- **Demo:** hook that screenshots before every deploy

### 5. Background Agents (`Agent` tool with `run_in_background`)
Your agent delegates to other agents. You become a manager, not an executor.
- **Closes:** the "wait for this before doing that" loop
- **Demo:** 3 parallel research agents running while you keep working

**Unifying idea:** Each tool removes a different reason you'd re-trigger the agent manually. Stack them → the agent runs itself.

---

## 3. Skills: The Counter-Intuitive Truth

**The principle:**
> **"The best skill is one you tailored PRECISELY to your process. Not one you downloaded."**

Aviz's insight (added during planning):
- The marketplace intuition ("let me find a skill for X") is backwards.
- **Downloaded skills are generic. Your process is specific.**
- A skill that fits your flow like a glove is always better than one that fits 80% of everyone's flow.
- The misconception: "this requires a lot of work." **Wrong.** A good skill often starts as 20 lines. It grows **with you** as your process grows.
- **Skills co-evolve with the process.** You don't sit down to "write a skill" - you notice "I did this three times, let me teach the agent once" → you have a skill.

**Why this matters for the "closing the loop" thesis:**
A generic skill that doesn't fit your flow **requires manual overrides** every time = open loop. A tailored skill = closed loop because it already knows your specifics.

**Workshop framing:** Include a brief segment on this in section 8 (alongside Code vs Desktop Cowork discussion). The downloaded-skill mistake is very common in the audience.

---

## 4. Claude Desktop Cowork - Research Findings (summary)

Full report: `research/claude-desktop-cowork.md`

**Bottom line:** Cowork is NOT a replacement for Claude Code. It's a sibling product aimed at non-developers. The three deal-breakers for power users:

1. **No hooks** (GitHub issue #27398) - kills automation-first workflows
2. **No headless / no Linux / no remote-server** - kills VPS-based agents (OpenClaw, beds-fast, hermes, etc.)
3. **Skills don't sync** across surfaces - your ~100 CLI skills are invisible to Cowork; hook-based skills won't work at all

**Audit/security red flag:** Anthropic itself says "do not use for regulated workloads." Cowork activity isn't in audit logs.

**The real April 2026 story for power users:** Claude Code's redesigned **desktop app** (14 April) - parallel sessions, git worktrees, Routines, full parity with CLI. This is the evolution. Cowork is a different SKU.

**Workshop narrative:** "Cowork = training wheels. Claude Code = the spaceship." Hybrid stance recommended - but for anyone who wants to close loops with hooks/cron/remote/skills, Claude Code stays the primary surface.

---

## 5. Audience & Tone

### Audience
- Already familiar with Claude Code / Claude Desktop basics
- Feels "AI helps but adds work to my plate"
- Claudosh series alumni ready to level up
- Business owners who want a **worker**, not a lab experiment

### Not a fit
- Never opened a terminal (wait for the renewed basics workshop)

### Tone
- **Low-gas, practical, not hypey** (learned from prior workshop feedback)
- **"We're back"** - welcoming, not apologetic about the break
- **Teaching, not selling** - no course push during the workshop itself; the preview at the end is enough

---

## 6. Signature Lines (to reuse in marketing + slides)

> **"סוכן שלא סוגר לופ הוא לא עובד. הוא עוד מנהלת שהעסקת."**
> ("An agent that doesn't close a loop is not an employee. It's another manager you hired.")

> **"5 כלים סוגרים לופ: plan, tasks, cron, hooks, background. הבן אותם - קיבלת עובד."**
> ("5 tools close the loop: plan, tasks, cron, hooks, background. Understand them - you got an employee.")

> **"הסקיל הכי טוב זה הסקיל שתפרת לתהליך שלך. לא זה שהורדת."**
> ("The best skill is the one you sewed to your process. Not the one you downloaded.")

---

## 7. Live Demo Plan

The demos are the backbone - participants will remember visuals, not slides.

| # | Demo | Section | Goal | Risk |
|---|------|---------|------|------|
| 1 | Open-loop pain (AI chat without tools) | Section 1 | Viscerally feel the pain | Low |
| 2 | Plan mode: task with vs without | Section 3 | See the approval-upfront mechanic | Low |
| 3 | Tasks: agent crashes and resumes | Section 4 | See persistent state | Medium - might not trigger crash cleanly |
| 4 | Cron: morning routine running live | Section 5 | See time-as-trigger | Low (can run pre-recorded) |
| 5 | Hook: screenshot-before-deploy | Section 6 | See event-as-trigger | Low |
| 6 | 3 parallel background agents | Section 7 | See manager-not-executor | Medium - needs network |

**Backup rule:** Record each live demo once the night before as a video fallback, in case anything fails live.

---

## 8. Marketing Angles (for poster + WhatsApp + FB)

- **Primary hook:** "הסוכן שלך עוזר או מוסיף לך עבודה? תבדוק עם 4 שאלות."
  (Does your agent help you or add work? Test with 4 questions.)
- **Credibility hook:** "חזרנו. ראשונה בסדרת סדנאות חדשה - 1-2 בשבוע, ₪100."
- **Curiosity hook:** "5 כלים שהופכים Claude Code לעובד אמיתי. plan, tasks, cron, hooks, background."
- **Differentiation hook:** "למה אני לא עובר ל-Claude Desktop Cowork - ולמה זה רלוונטי גם אליך."

---

## 9. Connection to Broader Product Vision

This workshop is also the **top of the funnel** for the atomic-businesses offering (see `~/aviz-crm/products/VISION.md` + `~/aviz-crm/products/ai-implementation/README.md`).

- Workshop ₪100 → Recording purchase → Consulting hours → Spaceship Mode (₪1,500) → Full Implementation (₪10-20K)
- The loop-closing framework is the natural bridge: once someone understands *why* closed loops matter, they understand *why* they need implementation help, not just a recording.

**Do not sell during the workshop itself.** Preview at the end is enough.

---

## 10. Open Items Before Workshop

- [ ] Zoom link created and saved to workshop.md
- [ ] WhatsApp group created and link saved
- [ ] Registration / payment link (₪100)
- [ ] Poster designed
- [ ] Presentation plan written (presentation-plan.md)
- [ ] Slides created via NotebookLM Studio
- [ ] Each of the 6 demos rehearsed and backup-recorded
- [ ] Marketing push: 1 week out, 3 days out, day before, morning of
- [ ] Sneak-peek content (1-2 short posts/videos)

---

*Synthesized 2026-04-23 from planning conversation between Aviz and the agent.*
