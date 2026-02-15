# Session 3 - Agenda Draft

> Source: Deep Interview, 2026-02-15

## Time Allocation (120 min)

| Time | Block | Type | Duration |
|------|-------|------|----------|
| 0:00 | **Week Review + What You Built** | Show+Tell | 10 min |
| 0:10 | **The Agentic App Paradigm** | Theory | 15 min |
| 0:25 | **5 Building Blocks** | Theory+Demo | 15 min |
| 0:40 | **Build: WhatsApp Auto-Responder** | Practice | 35 min |
| 1:15 | **Agent SDK: Spawn & Monitor** | Practice | 15 min |
| 1:30 | **Schedule It: Cron Tasks** | Practice | 15 min |
| 1:45 | **Wrap-up + Homework** | Theory | 15 min |

**Ratio:** ~30 min theory, ~65 min practice, ~25 min admin/wrap

## Block Details

### Week Review (10 min)
- Show how projects compounded over 2 weeks
- Quick show-and-tell: anyone have a cool result?
- Reinforce: the leash is getting longer

### The Agentic App Paradigm (15 min)
- Key insight: what you've been building IS an application
- Comparison table: Classic App vs Agentic App
  - Runtime: Node.js → Claude Code
  - Logic: if/else → Skills + Rules
  - Database: PostgreSQL → Markdown files
  - UI: React → Chat interface
  - Deploy: Docker → `cd folder`
  - Build time: Weeks → Hours
- "You don't need to be a developer to build an application"

### 5 Building Blocks (15 min)
- CLAUDE.md = Constitution
- Skills = npm packages in natural language
- Commands = API endpoints
- Agents = Background workers
- Data Files = Markdown as database
- LIVE DEMO: Show a complete agentic app structure

### Build: WhatsApp Auto-Responder (35 min)
- New project folder from scratch
- Write CLAUDE.md defining the bot's personality and rules
- Add business knowledge (from session 2's deep interview output)
- Build skills: answer-question, check-availability, send-price-quote
- Connect WhatsApp (reuse Green API from session 2)
- Test: send message to bot, see it respond with business knowledge
- WOW moment: bot answers client questions accurately about YOUR business

### Agent SDK: Spawn & Monitor (15 min)
- What is Agent SDK? (programmatic control of Claude Code)
- Run a simple script that spawns an agent
- See how to monitor what the agent is doing
- Concept: this is how you'll run agents without terminal

### Schedule It: Cron Tasks (15 min)
- Set up a scheduled task for the auto-responder
- Agent runs every X minutes, checks for new messages, responds
- Show how to set up on Mac (launchd) or keep-alive patterns
- The leap: agent works while you sleep

### Wrap-up + Homework (15 min)
- Homework: keep the auto-responder running for a week
- Monitor how it handles real client messages
- Preview session 4: "Next week - you control everything from your phone"
- Discuss: hooks, safety boundaries (preview of session 4 safety topic)

## Open Questions
- Do we use the existing agentic-apps presentation HTML?
- What's the simplest cron setup for non-technical users?
- How do we handle participants whose WhatsApp setup failed in session 2?
