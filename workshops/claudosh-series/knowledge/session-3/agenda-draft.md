# Session 3 - Agenda Draft (Updated)

> Source: Deep Interview, 2026-02-15 (updated with security focus)

## Time Allocation (120 min)

| Time | Block | Type | Duration |
|------|-------|------|----------|
| 0:00 | **Week Review + What You Built** | Show+Tell | 10 min |
| 0:10 | **The Agentic App Paradigm** | Theory | 15 min |
| 0:25 | **5 Building Blocks** | Theory+Demo | 10 min |
| 0:35 | **Build: WhatsApp Auto-Responder** | Practice | 30 min |
| 1:05 | **Hooks & Tool Control** | Theory+Practice | 25 min |
| 1:30 | **Agent SDK + Scheduling** | Practice | 15 min |
| 1:45 | **Wrap-up + Homework** | Theory | 15 min |

**Ratio:** ~25 min theory, ~70 min practice, ~25 min admin/wrap

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

### 5 Building Blocks (10 min)
- CLAUDE.md = Constitution
- Skills = npm packages in natural language
- Commands = API endpoints
- Agents = Background workers
- Data Files = Markdown as database
- LIVE DEMO: Show a complete agentic app structure

### Build: WhatsApp Auto-Responder (30 min)
- New project folder from scratch
- Write CLAUDE.md defining the bot's personality and rules
- Add business knowledge (from session 2's deep interview output)
- Build skills: answer-question, check-availability, send-price-quote
- Connect WhatsApp (reuse Green API from session 2)
- Test: send message to bot, see it respond with business knowledge
- WOW moment: bot answers client questions accurately about YOUR business

### Hooks & Tool Control (25 min) ← NEW EXPANDED BLOCK
**This is the "security meets autonomy" session.**

#### What Are Hooks? (5 min)
- Scripts that run before/after every agent action
- Like security cameras + guards for your agent
- Three types: command hooks (bash scripts), prompt hooks (LLM-based), agent hooks (subagent)

#### PreToolUse: The Guard at the Gate (10 min)
- LIVE: Write a hook that blocks `rm -rf` commands
- LIVE: Write a hook that logs all Bash commands to a file
- Show settings.json configuration
- Explain matcher patterns: which tools trigger which hooks

#### Permission Rules: Allow/Ask/Deny (10 min)
- **Deny:** Agent can NEVER do this (overrides everything)
- **Ask:** Always prompts you first
- **Allow:** Trusted, auto-approved
- Evaluation order: deny → ask → allow
- PRACTICE: Participants configure rules for their auto-responder
  - Allow: read files, send WhatsApp
  - Ask: edit CLAUDE.md, install packages
  - Deny: delete files, access .env

### Agent SDK + Scheduling (15 min)
- What is Agent SDK? (programmatic control of Claude Code)
- Run a simple script that spawns an agent
- Set up a scheduled task for the auto-responder
- Show how to set up on Mac (launchd) or keep-alive patterns
- The leap: agent works while you sleep

### Wrap-up + Homework (15 min)
- Homework: keep the auto-responder running for a week
- Monitor how it handles real client messages
- Review the hooks: did they catch anything?
- Preview session 4: "Next week - prompt injection, swarms, and your Personal OS"

## Open Questions
- Do we use the existing agentic-apps presentation HTML?
- What's the simplest cron setup for non-technical users?
- How do we handle participants whose WhatsApp setup failed in session 2?
- Should we provide pre-written hook scripts they can copy?
