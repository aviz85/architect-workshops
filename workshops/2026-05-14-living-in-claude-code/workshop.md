# לגור בקלוד קוד

> אתה כבר מכיר את הכלי. עכשיו בוא תגור בתוכו.

## Logistics

| Field | Value |
|-------|-------|
| **Date** | Thursday, May 14, 2026 |
| **Time** | 10:00-16:00 (lunch break 13:00-14:00) |
| **Duration** | 5 hours content + 1 hour lunch |
| **Location** | Tel Aviv (Yishai finding venue) |
| **Format** | In-person, 100% hands-on (every participant builds on their laptop) |
| **Participants** | 20 max |
| **Price** | ₪2,000 per person |
| **Revenue potential** | ₪40,000 |
| **Target audience** | People who already use Claude Code and understand what it is |
| **Prerequisite** | Claude Code installed, has used it, understands the basics |

## Core Thesis

Aviz lives inside Claude Code. Every aspect of his business — client management, content creation, invoicing, marketing, scheduling, development — is wrapped by agents. This isn't a tool he uses; it's the operating system of his work.

The workshop takes people who already know Claude Code and transforms their relationship with it: from "a tool I open sometimes" to "the environment I live in." One day, hands-on, leave with a working system.

**The promise:** You walk in knowing Claude Code. You walk out living in it.

## Value Proposition

- Every participant already understands what CC can do — they've seen demos, tried it, maybe built something
- What they're missing: the **compound effect** — folder structure → CLAUDE.md → skills → integrations → everything wrapped
- This workshop delivers the full stack in one intensive day
- ₪2,000 = the price of getting it right once, instead of months of trial and error

## Team

| Role | Person | Responsibility |
|------|--------|---------------|
| **Lead instructor** | Aviz | Full workshop delivery, live demos |
| **Operations** | Yishai Cohen (partner) | Venue, logistics, coordination |
| **Assistants (2-3)** | TBD from freelancer pool | 1-on-1 help during hands-on blocks |

### Assistant candidates (freelancers)

- **Tzvi Ben-David** (FREE-001) — score 8, strong technically
- **Tal Elkubi** (FREE-002) — score 8, 8 years frontend
- **Shulamit Kornbly** (FREE-003) — score 7, engineering background

## Preparation Pipeline

### Phase 1: Build the flow (by May 7-8)
- [ ] Design detailed workshop agenda with timing
- [ ] Define what each participant should have at the end of each block
- [ ] Create exercise templates / starter files

### Phase 2: Practice with Yishai (by May 9-10)
- [ ] Run through entire flow with Yishai
- [ ] Yishai stress-tests from participant perspective
- [ ] Refine timing and transitions
- [ ] Finalize venue details

### Phase 3: Train assistants (by May 12)
- [ ] Invite 2-3 freelancers
- [ ] Brief them on the full flow
- [ ] Practice run with assistants
- [ ] Define their role: when to step in, how to help without taking over

### Phase 4: Final prep (May 13)
- [ ] All materials ready
- [ ] Venue confirmed and set up planned
- [ ] Participant communication sent

## Workshop Pipeline

| Stage | Status | Date |
|-------|--------|------|
| Concept | ✅ Done | 2026-05-06 |
| Agenda design | ⬜ | |
| Presentation plan | ⬜ | |
| Practice with Yishai | ⬜ | |
| Freelancer training | ⬜ | |
| Marketing & registration | ⬜ | |
| Venue confirmed | ⬜ | |
| Workshop delivered | ⬜ | 2026-05-14 |
| Follow-up | ⬜ | |

## The Layer Model

The workshop builds a complete agent ecosystem layer by layer. Each layer depends on the ones below it. **The emphasis is on layers 0-2** — that's where people fail, and that's what makes everything else work.

```
Layer 6 — סקייל                Scale — take the process, multiply it, make it something else
Layer 5 — תקשורת מרחוק        Remote communication (agent works while you're away)
Layer 4 — סוכנים ורוטינות       Sub-agents + cron routines (autonomous operation)
Layer 3 — סקילים               Skills (training the agent on knowledge + tools)
Layer 2 — אינטגרציות וכלים      Integrations and tools (connecting to real systems)
Layer 1 — פרויקט כבסיס ידע      Project as knowledge base (built around a use case)
Layer 0 — קלוד קוד על המחשב    Claude Code on the machine (foundation)
```

**Layer 6 — The Multiplier:** Once your system works for you (L0-L5), how do you take that and make it bigger? Train a team on it. Package it as a service. Replicate it across businesses. Build a product around it. This is the layer where personal productivity becomes a business model. Aviz doing this workshop *is* Layer 6.

**What people get wrong:** They jump to layers 3-6 (skills, agents, scale) without solid 0-2. The base layers + the personal habit of living inside the agent — that's what makes all the difference.

## The Responsibility Loop

The engine that runs inside every layer. Without this loop, you're just sending prompts and hoping. With it, you're managing an agent.

```
   Action → Observe → Judge → Improve
     ↑                          │
     └──────────────────────────┘
```

### The four steps

| Step | What happens | Example |
|------|-------------|---------|
| **Action** | The agent does something | Sends a WhatsApp message to a client |
| **Observe** | See what happened in the environment | Was the message sent? Was the tone right? Did the client respond? |
| **Judge** | Evaluate: is this what I wanted? | "The message was too formal. Next time, more casual." |
| **Improve** | Make the agent better for next time | Update the skill / CLAUDE.md / knowledge so the agent doesn't repeat the mistake |

### The critical question at each step

At every step, ask: **does the agent actually have the ability to do this?**

| Step | The question | If missing |
|------|-------------|------------|
| **Action** | Can the agent act? Does it have the right tools, integrations, permissions? | → Build Layer 2 (integrations) |
| **Observe** | Can the agent see the results? Can it read the environment? | → Add observation capabilities (logs, screenshots, API responses) |
| **Judge** | Does the agent have the criteria to evaluate quality AND the intelligence to distinguish between acceptable and unacceptable? Knowing the standard is not enough — it needs to be smart enough to apply it in context. | → Strengthen Layer 1 (knowledge, CLAUDE.md) + choose a model with sufficient reasoning capability |
| **Improve** | Can the agent update itself? Can it write to its own skills, knowledge, memory? | → Build Layer 3 (skills that write skills) |

**If any step is missing, the loop is broken.** The most common gap: agents that can act and observe, but cannot improve themselves. They make the same mistake forever. The whole point of living inside Claude Code is closing this loop — the agent gets better every day because it can improve its own knowledge, skills, and behavior.

### The loop at every layer

- **L1:** Write CLAUDE.md → observe agent behavior → judge if it understood you → improve the CLAUDE.md
- **L2:** Connect WhatsApp → observe if messages arrive correctly → judge quality → improve the integration config
- **L3:** Build a skill → observe if it fires when it should → judge output → improve the skill itself
- **L4:** Set up a routine → observe daily results → judge if it's doing what you want → improve the routine
- **L5:** Agent runs remotely → observe outcomes from afar → judge without being there → agent improves itself autonomously

The loop is what turns "using a tool" into "managing an employee." You don't tell an employee what to do once and walk away. You watch, evaluate, correct, and **make sure they learn from it.** That's what living inside Claude Code means — running this loop continuously until the agent is trained on YOUR standards, and can keep improving on its own.

## Agenda

### Opening (10:00-10:30)

#### הצתה + הגדרת יעד
**"ההבדל בין לגור בתוך סוכן לבין כל מה שהיה עד היום"**

- The paradigm shift: not a tool you open, an environment you live in
- "ממש כמו לנהל עובדים" — the employee metaphor
- The dramatic economic meaning: what changes when everything is wrapped
- Aviz shows the layer model — where most people are stuck (L0-1 shaky, jumping to L3-5)
- **Each participant defines their success criteria:** what will you have by 16:00?
- Assistants help people land on a realistic but ambitious target

---

### Layer 0+1 — הבסיס (10:30-12:30) ⭐ Core block — 2 hours

#### "הסוכן שלך צריך לדעת מי אתה ומה אתה רוצה"

This is the longest and most important block. If this is solid, everything else flows.

**Layer 0 — Claude Code on the machine:**
- Verify everyone's setup works, troubleshoot issues
- The mental model: terminal/VS Code, context window, what the agent sees
- Settings, permissions, the right way to start a session

**Layer 1 — Project as knowledge base:**
- Build a real project from scratch: folder → CLAUDE.md → knowledge files
- The long-term goal concept: the agent manages a direction, not just tasks
- Each participant builds around their own business/domain — not a toy exercise
- Live demo: Aviz builds one from scratch, then participants do theirs
- Assistants go 1-on-1 with anyone stuck

**The habit layer (woven throughout):**
- How you start your day inside CC
- How you talk to it — not prompting, directing
- The difference between "using a tool" and "living in an environment"

**Participant leaves with:** A real project with CLAUDE.md and knowledge base that works. The agent knows who they are, what they do, and what they're building toward.

---

### Layer 2 — אינטגרציות וכלים (12:30-13:00)

#### "לחבר את הסוכן לעולם האמיתי"

- What integrations exist: WhatsApp, email, calendar, browser, APIs
- Live demo: wire up an integration that delivers real value
- Participants identify which integration matters most for their use case
- Start connecting — continue after lunch

**Participant leaves with:** Understanding of what's possible + first integration started

---

### Lunch Break (13:00-14:00)

---

### Layer 2 continued + Layer 3 — סקילים (14:00-15:15)

#### "לתרגל את הסוכן על הידע והכלים"

**Layer 2 wrap-up (14:00-14:30):**
- Complete the integration from before lunch
- Test it end-to-end: does the agent actually use it?

**Layer 3 — Skills (14:30-15:15):**
- What's a skill: turning a repeated action into a permanent capability
- The key insight: skills complete the missing action paths between knowledge and tools
- Live demo: Aviz builds a skill that bridges a gap in his system
- Each participant identifies one gap in their L1+L2 → builds a skill for it
- The compound effect: skill 1 enables skill 2, which enables skill 3...

**Participant leaves with:** At least one working skill that connects their knowledge to their tools

---

### Layers 4-5 (15:15-15:45)

#### "מה קורה כשהסוכן רץ לבד"

**Layer 4 — Sub-agents and routines (15:15-15:30):**
- Agents that spawn agents, scheduled tasks (cron)
- Hands-on: each participant sets up a sub-agent or a scheduled routine in their project
- Live demo: Aviz shows a routine that runs daily, then participants build their own

**Layer 5 — Remote communication (15:30-15:45):**
- The agent works while you're away: background agents, remote triggers
- Hands-on: configure a background agent or remote trigger for their use case

---

### Layer 6 — סקייל + סגירה (15:45-16:00)

#### "איך לוקחים את זה ומכפילים"

- You now have a working system (L0-L5). Now what?
- Scale = taking your process and making it something bigger:
  - Train your team to work the same way
  - Package your system as a service for clients
  - Replicate across multiple businesses / domains
  - Build a product around your methodology
- Aviz's own story: built L0-L5 for himself → this workshop IS Layer 6
- Each participant thinks: what does MY Layer 6 look like?
- 2-3 participants showcase what they built today
- The daily habit checklist: morning start, evening close, the rhythm of living inside CC

**Participant leaves with:** A working L0-L5 system + a vision for how to multiply it

---

### Flow Summary

| Time | Layer | Focus | Deliverable |
|------|-------|-------|-------------|
| 10:00-10:30 | — | הצתה + יעד | Paradigm shift + personal success criteria |
| 10:30-12:30 | **L0+L1** ⭐ | הבסיס | Project + CLAUDE.md + knowledge + the habit |
| 12:30-13:00 | L2 start | אינטגרציות | First integration identified + started |
| 13:00-14:00 | — | צהריים | — |
| 14:00-15:15 | L2+L3 | כלים + סקילים | Integration working + first skill |
| 15:15-15:45 | L4+L5 | סוכנים + מרחוק | Sub-agent + routine working |
| 15:45-16:00 | **L6** | סקייל | Vision for multiplying + showcase |

**Everything is hands-on.** No block is lecture-only. Every layer: Aviz demos → participants build on their own machine → assistants help 1-on-1. The emphasis on L0-L1 is about depth of practice, not more talking.

**Time allocation:** ~60% on L0-L1 (the base), ~25% on L2-L3 (tools + skills), ~15% on L4-L6 (agents + scale + closing)

## Notes

- First full-day, in-person workshop — premium format
- Yishai is a business partner (term sheet drafted 27.04, pending signing)
- Revenue from this workshop falls under the partnership period (post May 1)
- Participants bring their own laptops — this is hands-on
