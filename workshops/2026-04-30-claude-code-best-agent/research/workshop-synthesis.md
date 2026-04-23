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

## 2b. The Apex Pattern: Decision-Surfacing Dashboard

The 5 tools above close *tactical* loops. The apex of loop-closing is a **dashboard pattern** that closes the *coordination* loop across many parallel agents.

### The architecture

- **N agents run in parallel** (classic Claude Code spawn — `Agent` tool, `run_in_background: true`)
- **Each agent is trained**: when you hit a critical decision, **don't stop silently** — surface the question to a shared dashboard. Keep working on whatever you can. Wait for the answer.
- **You see one pane of glass:** all pending questions + all current statuses of all agents.
- **You decide once** → the blocked agent resumes immediately → status updates flow back.
- **Optional: dashboard syncs to WhatsApp** → you answer decisions from phone, road, anywhere.

### Why it's the apex

Every other loop-closing tool still assumes **you'll come back to the agent**. This pattern inverts the relationship: **the agent comes back to you, but only when genuinely needed**. The rest of the time, it's working.

- 5 agents in parallel
- 2 get blocked on critical decisions
- You see the dashboard, answer 2 questions in a minute
- All 5 keep running
- **Your attention is fully decoupled from agent execution**

This is the ceiling of "loop-closing." Not a hypothetical — the primitives all exist (spawn, run_in_background, hooks, tasks, WhatsApp via Green API). Integration into a dashboard is the assembly work.

### Workshop treatment

Section 7 in workshop.md now covers this as the **pinnacle demo** in the background-agents tool. Show:
1. 3 parallel spawn
2. One agent explicitly asks a "decision question" via surfacing mechanism
3. Dashboard rendering (can be simple — console, local HTML, Claude Code's own task list)
4. Hint: this syncs to WhatsApp in Aviz's own setup

Don't build the dashboard live — show the pattern, leave the build as an aspiration for attendees.

### Teaching principle to emphasize

> **"A good agent doesn't ask you what to do. It tells you what it needs you to decide — while the other agents keep running."**

This is the explicit extension of the CLAUDE.md "no open loops" principle applied recursively: sub-agents must also close loops, and the mechanism they use is decision-surfacing, not blocking.

---

## 2c. Reference Implementation — `peleg-orchestra`

The dashboard pattern already exists in a working form in Aviz's own repo: `~/peleg-orchestra/`. Inspired by Yam Peleg's tweet demo. **The insight:** your chat app IS the dashboard.

### How it works (the elegant bit)

- **One WhatsApp group** = orchestrator command center
- **New message** → spawns a new `claude -p` agent with a fresh `sessionId` (UUID)
- **Reply to an agent's message** → routes to that specific agent via `claude -p --resume {sessionId}` — exact context restoration
- **Per-agent state:** `agents/registry.json` tracks each agent's sessionId + array of all message IDs they've sent → lookup on reply is a simple `.includes()`
- **Voice message** → transcribed by Groq whisper → processed as text
- **`bypassPermissions`** for full autonomy

### Why this nails every principle

| Workshop principle | How peleg-orchestra embodies it |
|---|---|
| **Close the loop** | Reply = resume. No separate UI, no orphan contexts. |
| **Surface decisions** | Agent sends a question → message shows in WhatsApp → you reply from phone → agent resumes. |
| **Keep agents running** | Each agent is its own process. Your typing speed is not the bottleneck. |
| **No new tools needed** | WhatsApp is universal. Anyone who uses WhatsApp already has the dashboard. |
| **Mobile-native** | You're always on your phone. Decisions from the road, the couch, the grocery line. |
| **Parallel-first** | N agents, one channel, clean routing via reply threading. |

### The "message-ID-as-session-router" trick

The architectural gem is that **every message Claude Code sends is a potential resume entry-point**. WhatsApp's native "reply" UX becomes Claude Code's `--resume` command. No glue code, no dashboard framework, no state sync — the chat IS the state.

### Design notes for Aviz's future version (if he builds it by 2026-04-30)

If extending peleg-orchestra toward the "dashboard of decisions" vision:

1. **Decision tagging convention.** When an agent needs input, prefix the message with `⚠️ DECIDE:` (or similar). Aviz can filter/star these on WhatsApp to see the "pending decisions" view. No custom UI needed.
2. **Status heartbeats — optional and quiet.** Long-running agents send a brief `🟡 still working on X (ETA Y)` every N minutes. Turn off for most; on for the critical ones.
3. **Agent types via system-prompt templates.** Today one generic `system-prompt.md`. Extend to: `research-agent.md`, `implementation-agent.md`, `monitoring-agent.md` — each with different autonomy/verbosity defaults.
4. **Task-system integration.** When an agent surfaces a decision, it also creates a task in Aviz's global task list. If he answers on WhatsApp, the task auto-completes.
5. **Short-keyword responses.** For common decision types (`y`/`n`/`skip`/`defer 1h`), the orchestrator can recognize them and translate into structured agent input.
6. **Priority lanes.** Agent can declare "I'm blocking until you answer" vs "I'll continue on best guess and flag for review." The latter is the true loop-closing default.
7. **Multi-channel redundancy.** WhatsApp + Telegram already supported. Consider email for async/slow decisions (TODO already in the repo: "handle emails").

### Workshop treatment

Section 7 demo goes further:
1. Show 3 `Agent` tool spawns from CLI as the base pattern
2. Pivot: open peleg-orchestra, send a WhatsApp message, show the agent spawn live
3. Reply to the agent's response → show the resume, same context
4. Closing line: *"This already exists. It's yours. The dashboard you wanted — you already have it. WhatsApp is the dashboard."*

This converts the apex pattern from abstract theory into something the audience can install, use, and extend today.

### Signature line (to add to marketing + slides)

> **"הדשבורד שאתה מחפש כבר קיים. זה WhatsApp. הצ'אט הוא המערכת."**
> ("The dashboard you're looking for already exists. It's WhatsApp. The chat is the system.")

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

Strategic context (funnel, community model, upsell, product tiers) lives in aviz-crm, not here. See:
- `~/aviz-crm/products/atomic-businesses-concept-evolution.md` — product architecture
- `~/aviz-crm/products/ai-implementation/README.md` — implementation service
- `~/aviz-crm/products/consulting/pricing-comparison.md` — pricing ladder

**Pedagogical rule for this workshop:** Do not sell during the session. Preview at the end is enough — funnel mechanics happen *after* the workshop.

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
