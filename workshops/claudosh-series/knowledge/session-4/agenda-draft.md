# Session 4 - Agenda Draft (Updated)

> Source: Deep Interview, 2026-02-15 (updated with expanded security)

## Time Allocation (120 min)

| Time | Block | Type | Duration |
|------|-------|------|----------|
| 0:00 | **Month Review: The Journey** | Show+Tell | 10 min |
| 0:10 | **Agent Swarms Demo** | Demo | 20 min |
| 0:30 | **Prompt Injection & Defense** | Theory+Demo | 25 min |
| 0:55 | **WhatsApp Command Center** | Demo | 20 min |
| 1:15 | **Design Your Personal OS** | Exercise | 20 min |
| 1:35 | **Participant Showcase** | Show+Tell | 15 min |
| 1:50 | **Vision: Where This Goes** | Talk | 10 min |

**Ratio:** ~25 min theory, ~20 min exercise, ~40 min demos, ~35 min showcase/vision

## Block Details

### Month Review: The Journey (10 min)
- Recap the 4-week leash journey
- Show the compound effect in real numbers
- "Look how far you've come from that first terminal command"

### Agent Swarms Demo (20 min)
- LIVE: Aviz spawns 3 agents on ONE task
- Example: "Prepare everything for a client meeting with Yossi Cohen"
  - Agent 1: Pull CRM history, summarize relationship
  - Agent 2: Research Yossi's company - latest news, competitors
  - Agent 3: Draft meeting agenda + follow-up email
- All work simultaneously, results merge into one briefing document
- Explain: how swarms work, when to use them, the orchestration pattern

### Prompt Injection & Defense (25 min) ← EXPANDED SECURITY BLOCK

#### What is Prompt Injection? (10 min)
- **The concept:** Malicious text hidden in files/web that hijacks your agent
- **Why it matters now:** You're giving agents more autonomy → risk grows
- **Analogy:** Like a con artist who slips fake instructions into your employee's briefing folder

**Real-world attack vectors (safe demos):**

1. **Malicious CLAUDE.md in cloned repos**
   - DEMO: Clone a repo with hidden instructions at bottom of CLAUDE.md
   - Show: agent reads it and tries to follow the injected instructions
   - Defense: Claude asks permission, YOU read the prompt

2. **Instructions hidden in files**
   - DEMO: File that looks innocent but contains "ignore previous instructions"
   - Show: what happens when agent reads it
   - Defense: hooks + permission system

3. **Web content manipulation**
   - DEMO: Web page with hidden prompt injection
   - Show: how context isolation protects

4. **MCP server output**
   - Concept: third-party tools can return manipulative output
   - Defense: only use trusted MCP servers

#### How Claude Code Defends (5 min)
- Permission system (agent asks before risky actions)
- Fail-closed (unknown commands need approval)
- Command blocklist (curl/wget blocked by default)
- Context isolation (web fetches separated)
- Trust verification (new repos prompt)

#### How YOU Defend (10 min)
The Security Pyramid - layers of defense:
```
🔒 Layer 5: Sandboxing (OS-level isolation)
🔒 Layer 4: Hooks (intercept every action)
🔒 Layer 3: Permissions (allow/ask/deny rules)
🔒 Layer 2: Trust verification (new repos)
🔒 Layer 1: Core protections (blocklist)
```

**Practical rules:**
1. Always READ permission prompts (don't auto-click yes)
2. Don't enter untrusted repo folders
3. Use hooks from session 3 as guard system
4. Restrict tools to what's needed
5. Review what the agent did (audit logs)
6. For sensitive work: sandbox mode

**Key message:**
> "ככל שהסוכן חזק יותר, האחריות שלכם גדלה. זה לא מפחיד - זה בדיוק כמו לנהל עובד. אתם קובעים את הגבולות."

### WhatsApp Command Center (20 min)
- Aviz's full Peleg Orchestra demo
- LIVE: Send voice message from phone → agent processes → results back
- Show: "Prepare a quote for David Levi" → CRM → PDF → WhatsApp
- Show: voice message workflow (speak → transcribe → execute → respond)
- Show: always-on agent concept (OpenClaw, morning briefings)
- Participants take notes: "what would MY command center look like?"
- **Note: show safety layers around the command center too**

### Design Your Personal OS (20 min)
- Interactive exercise: each participant maps their system
- Template to fill:
  - What projects do you need?
  - What skills should each have?
  - How do they connect?
  - What runs on autopilot? What needs approval?
  - What's controlled from phone?
  - **NEW: What are the security boundaries? What hooks do you need?**
- Aviz reviews 2-3 live, gives feedback

### Participant Showcase (15 min)
- 2-3 participants show what they built over 4 weeks
- Celebrate wins, acknowledge struggles
- Community moment: you're not alone in this

### Vision: Where This Goes (10 min)
- Compound effect: 1% daily = 37x in a year
- The automation ladder: Executor → Manager → Strategist → Approver
- Community: alumni WhatsApp group, continued support
- Mentoring model: advanced help beginners (gym model)
- "You started as operators. You're leaving as architects."

## Open Questions
- Does Aviz need to prepare prompt injection demo files in advance?
- Create a safe "honeypot" repo with prompt injection for live demo?
- What template for "Design Your Personal OS" exercise?
- Is there an alumni community structure already?
- Certificate/completion recognition?
