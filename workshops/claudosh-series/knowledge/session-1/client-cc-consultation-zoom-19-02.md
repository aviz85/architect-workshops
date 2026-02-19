# Client CC Consultation - Zoom 19.02.2026

> 35-minute consultation with client group (Niv, Ran) on Claude Code setup
> Relevant to series: reveals real beginner pain points and misconceptions

---

## Key Issues Discovered

### 1. Skills in Wrong Location
- Client had custom "skills library" folder on D: drive with custom menu system
- Bypasses built-in `.claude/skills/` system
- **Fix:** Skills belong in `~/.claude/skills/` (global) or `.claude/skills/` (project)

### 2. Agents in Wrong Location
- Agents stored in custom folder, not `.claude/agents/`
- Custom "agent creation" flow that doesn't use native system
- **Fix:** Agents go in `~/.claude/agents/` (global) or `.claude/agents/` (project)

### 3. Not Knowing Claude Code Guide
- Didn't know model doesn't inherently understand skills/agents
- Training predates skills concept - can hallucinate incorrect structures
- **Fix:** CLAUDE.md rule: "consult claude-code-guide for skills/agents"

### 4. Skills Architecture Misunderstanding
- Thought all skills fully loaded into context
- **Reality:** ~100 tokens per skill (description only), full loads on demand
- 50 global skills is borderline - distribute into projects

### 5. Agent vs Skill Confusion
- **Skill:** Integrates into current flow, all tools available
- **Agent:** Parallel execution, fresh context, limited tools
- Use case: 4 research agents parallel → summarizer combines

### 6. Context Window Management
- Hit context limits, didn't know about compact/clear/undo
- Double-Escape to go back, `/compact`, `/clear`

### 7. WhatsApp Integration
- Green API: messages sometimes stuck "pending", reliability issues
- Official WhatsApp Business API (Meta): ~50-100 NIS/month, reliable
- Aviz himself seeing Green API problems

### 8. Hebrew = More Tokens
- Client works entirely in Hebrew - acceptable trade-off for clarity

### 9. Git/GitHub vs Private Server
- Client uses UpCloud with Gitea-like interface instead of GitHub
- Recommendation: also sync to GitHub (free backup, portability)

## Key Quote

> "תנסה להיות פחות חכם - פחות לחשוב, פחות לתכנן לבד. תגיד לו 'אני רוצה ליצור סוכן, תסביר לי איך זה עובד' - כמו שאתה שואל אותי, אבל עם קוד גייד"

## Full Transcript

See `client-cc-consultation-zoom-19-02-transcript.md`
