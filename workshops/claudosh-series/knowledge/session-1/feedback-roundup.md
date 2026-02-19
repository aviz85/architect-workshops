# Session 1 Feedback Roundup - All Sources

> Compiled 2026-02-19 from 3 sources: Guy Ronen (co-presenter), Uriel Herzog (advisor, WhatsApp voice), client CC consultation Zoom

---

## Source 1: Guy Ronen (Co-Presenter) - WhatsApp 16.02

### Key Points

1. **Move to VS Code** - Terminal is a recurring pain point. Aviz keeps "apologizing" for it. Stop. Switch to VS Code.
2. **Pre-session questionnaire** - Mac/Windows? Claude subscription? Installed CC? Familiar with terminal?
3. **Opening too long** - Too much talking before hands-on. Get to keyboard faster.
4. **Prepare everything in advance** - Installation guide with screenshots, ready-made prompts to copy-paste, pre-built demo project (don't improvise).
5. **Security too early** - Prompt injection scares beginners in session 1. Move to sessions 3-4.
6. **Pace too slow** - More dynamics, less explaining, more doing.
7. **Co-Host in Zoom** - Guy needs permissions to mute participants.
8. **One screen at a time** - Two presenters sharing screens simultaneously caused confusion.

### What Worked (keep)

- Two-presenter format is excellent balance (Aviz = enthusiasm + vision, Guy = grounding + clarity)
- Hands-on in real-time
- Raise Hand polls for audience check
- Demo from both OS (Mac + Windows)
- Small group (~25-30) enables personal support
- Safety as "triangle" made it structured, not scary

---

## Source 2: Uriel Herzog (Participant) - WhatsApp Voice 18.02

### Voice Message 1 (2:04) - Installation Problem

**Core issue:** Installation is a critical barrier.

- Uriel was **very close to giving up** during installation
- Eventually someone in chat randomly helped - "pure luck"
- The live format can't give personal troubleshooting to everyone

**Proposals:**
1. **Map ALL possible installation problems** - Take a clean Windows + Mac, install from scratch, document every failure point
2. **Create a specialized installation bot** - An expert that knows all the solutions
3. **Pre-session installation meeting** - Zoom session dedicated ONLY to installation, with assistants helping
4. **Course starts only AFTER everyone is installed** - Separate installation from learning
5. Installation took ~1.5 hours - that's wasted if mixed into content

> "Installation is essential - if you can't install, you leave. But spending 1.5 hours on it in the session kills the energy."

### Voice Message 2 (0:44) - Synergy & Audience

- **Guy + Aviz synergy is great** - "You complete each other, it's meaningful to have another perspective"
- Overall **positive factor** in the evening
- Participants are still very "green" - don't yet see the potential
- "I believe in the next sessions people will start to smell it"

---

## Source 3: Client CC Consultation - Zoom 19.02 (35 min)

### Context

Aviz gave a 1-on-1 Claude Code consultation to a client group (with Niv and Ran). This reveals real beginner pain points and misconceptions - directly relevant to what series participants will face.

### Issue 1: Skills in Wrong Location

- Uriel had a custom "skills library" folder on D: drive
- He built a custom mechanism: number menu → reads from custom folder → creates skill
- **Problem:** This bypasses the built-in `.claude/skills/` system
- **Fix:** Skills belong in `~/.claude/skills/` (global) or `.claude/skills/` (project)
- Built-in system auto-detects skills - no custom routing needed

### Issue 2: Agents in Wrong Location

- Uriel had agents stored in a custom folder, not in `.claude/agents/`
- Custom "agent creation" flow that doesn't use native agent system
- **Fix:** Agents go in `~/.claude/agents/` (global) or `.claude/agents/` (project)
- Native agents are auto-discovered and can be spawned by Claude automatically

### Issue 3: Not Knowing Claude Code Guide

- Uriel didn't know the model doesn't inherently understand skills/agents
- **Key insight:** Claude's training predates skills concept - it can hallucinate incorrect skill structures
- **Fix:** Add to CLAUDE.md: "When working with skills/agents, consult claude-code-guide first"

### Issue 4: Skills Architecture Misunderstanding

- Uriel thought all skills are fully loaded into context
- **Reality:** Only ~100 tokens per skill (description only). Full skill loads on demand
- Having 50 global skills is borderline - better to distribute into projects
- Global skills = things you need everywhere. Project skills = project-specific

### Issue 5: Agent vs Skill Confusion

- Uriel didn't understand when to use agents vs skills
- **Skill:** Integrates into current conversation flow, has access to all tools
- **Agent:** Runs in parallel, fresh context, can have limited tools
- **Use case for agents:** Research tasks, parallel work, isolated tasks
- Example: 4 research agents in parallel → summarizer agent combines results

### Issue 6: Context Window Management

- Uriel experienced context filling up without proper compacting
- Didn't know about: double-Escape (undo), `/compact`, `/clear`
- **Fix:** Explain compact mechanism - Claude should auto-compact, but if missed, go back a step first

### Issue 7: WhatsApp Integration Concerns

- Uriel afraid to connect WhatsApp (fear of getting blocked)
- **Reality:** Green API has issues - messages sometimes stuck on "pending"
- **Better option:** Official WhatsApp Business API (Meta) - costs ~50-100 NIS/month but reliable
- No blocking risk with official API (unless spam reports)
- Aviz himself uses Green API but seeing problems

### Issue 8: Hebrew Skills Take More Tokens

- Uriel works entirely in Hebrew (skills, CLAUDE.md, everything)
- **Reality:** Hebrew uses more tokens than English
- Uriel's response: "We don't care, as long as it's organized"

### Issue 9: Git/GitHub vs Private Server

- Uriel uses UpCloud private server with Gitea-like interface instead of GitHub
- Pushes directly to server, has 100GB storage
- **Aviz recommendation:** Also sync to GitHub (free, standard, backup)
- Uriel resists - "why do I need GitHub if I have my server?"
- Aviz explains: portability, free backup, standard workflow, sync multiple machines

### Key Quote from Aviz to Uriel

> "תנסה להיות פחות חכם - פחות לחשוב, פחות לתכנן לבד. תגיד לו 'אני רוצה ליצור סוכן, תסביר לי איך זה עובד' - כמו שאתה שואל אותי, אבל עם קוד גייד"
>
> "Try to be less clever - less thinking, less planning on your own. Tell it 'I want to create an agent, explain how it works' - like you're asking me, but with code guide."

---

## Consolidated Conclusions

### What Must Change for Session 2+

| # | Change | Source | Priority |
|---|--------|--------|----------|
| 1 | **Separate installation from content** - pre-session Zoom or async guide | Guy + Uriel | Critical |
| 2 | **Move to VS Code** as default interface | Guy | High |
| 3 | **Pre-session questionnaire** | Guy | High |
| 4 | **Ready-made prompts and demo projects** | Guy | High |
| 5 | **Faster pace** - less intro, more hands-on | Guy | High |
| 6 | **Security/injection moved to sessions 3-4** | Guy | Medium |
| 7 | **One screen share at a time** | Workshop summary | Medium |
| 8 | **Co-Host for Guy in Zoom** | Guy | Quick fix |

### What Must Be Taught More Clearly

| # | Topic | Evidence from Uriel Session |
|---|-------|---------------------------|
| 1 | **Where skills/agents live** (.claude/skills, .claude/agents) | Uriel had custom folders |
| 2 | **Claude Code Guide is essential** | Uriel didn't know about it |
| 3 | **Skills = description loaded, full on demand** | Uriel thought everything loaded |
| 4 | **Agent vs Skill - when to use which** | Uriel confused the two |
| 5 | **Context management** (compact, clear, undo) | Uriel hit context limits |
| 6 | **"Be less clever"** - use built-in, don't invent | Uriel built custom workarounds |
| 7 | **WhatsApp: Green API risks vs official API** | Uriel afraid of blocking |

### What Works (Preserve)

| # | Element | Source |
|---|---------|--------|
| 1 | **Two-presenter format** (Aviz + Guy) | Guy, Uriel, workshop summary |
| 2 | **Hands-on in real-time** | All sources |
| 3 | **Small group size** (~25-30) | Workshop summary |
| 4 | **Dual OS demo** (Mac + Windows) | Workshop summary |
| 5 | **Community (WhatsApp group)** for async help | Uriel's installation was saved by chat |

### Emerging Idea: Installation Bot / Pre-Session

Multiple sources converge on separating installation:

**Option A: Pre-session Zoom (Uriel's suggestion)**
- Dedicated Zoom session, only installation
- Bring assistants to help
- Course starts only after everyone is installed

**Option B: Installation bot (Uriel's suggestion)**
- Map ALL installation failure points (clean Mac + Windows)
- Create specialized troubleshooting bot
- Participants self-serve before session 1

**Option C: Async guide + checkpoint (Guy's suggestion)**
- Detailed guide with screenshots sent in advance
- Pre-session questionnaire confirms readiness
- Quick 5-min verification at session start (not 40 min)

**Recommended: Combine B + C** - Installation guide with bot backup, questionnaire to verify, minimal live troubleshooting.
