# Session 2 - Agenda Draft (Updated 22.02)

> Rewritten to focus on skills: anatomy, creation, stacking, compounding

## Time Allocation (120 min)

| Time | Block | Type | Duration |
|------|-------|------|----------|
| 0:00 | **Week Review + Compounding Intro** | Show+Tell | 10 min |
| 0:10 | **What is a Skill? Anatomy** | Theory+Demo | 15 min |
| 0:25 | **Where Skills Live — Files & Folders** | Demo | 10 min |
| 0:35 | **Hands-On: Create a Skill While Working** | Practice | 30 min |
| 1:05 | **Stacks = Compounding Power** | Theory+Demo | 15 min |
| 1:20 | **Aviz Demo: Working with Skill Stacks** | Live Demo | 20 min |
| 1:40 | **Wrap-up + Homework** | Theory | 10 min |
| 1:50 | **Buffer / Q&A** | Open | 10 min |

**Ratio:** ~25 min theory, ~70 min practice/demo, ~25 min admin

## Block Details

### Week Review + Compounding Intro (10 min)
- Check: who completed their project from session 1?
- Quick show-and-tell: anyone have a cool result?
- The agent got smarter over the week — show evidence
- Compounding principle intro: each layer builds on previous
- Quick mention: VS Code as alternative to raw terminal

### What is a Skill? Anatomy (15 min)
- Definition: a pre-written prompt that loads on demand
- Difference from Custom GPTs: skill = small, focused, composable
- The 100-token rule: only description loads, full content on demand
- Anatomy of a skill file: name, description, when to use, instructions
- LIVE DEMO: open a real skill file, walk through each part
- The "whisperer" from session 1: claude-code-guide is itself a skill

### Where Skills Live — Files & Folders (10 min)
- Two locations:
  - `~/.claude/skills/` — global (available everywhere)
  - `.claude/skills/` — project-level (specific to one project)
- When to use which: global = cross-project, project = context-specific
- LIVE DEMO: show both folders on Aviz's machine
- Show how Claude auto-discovers skills (no manual loading)
- Skill = just a folder with a markdown file — that's it

### Hands-On: Create a Skill While Working (30 min)
- **The approach:** Don't create a skill in isolation. Work on a real task, then capture the process as a skill.
- Step 1: Everyone opens their project from session 1
- Step 2: Do a real task with the agent (e.g., organize files, write a document, generate content)
- Step 3: Notice the pattern — "I'll want to do this again"
- Step 4: Ask Claude: "Turn what we just did into a skill"
- Step 5: Claude creates the skill file in `.claude/skills/`
- Step 6: Test it — invoke the new skill on a different input
- **Key insight:** Skills emerge from work, not from planning
- Provide ready-made prompts for participants who get stuck

### Stacks = Compounding Power (15 min)
- One skill = one capability
- Stack = skills working together
- The factory analogy: each worker does one thing, manager coordinates
- Example: "Send a proposal to Haim"
  - get-client-info → create-proposal → generate-pdf → send-email
  - 4 separate skills, 1 command
- Orchestrator skill: a skill that calls other skills in sequence
- SHOW: real orchestrator skill from Aviz's system
- The exponential effect: each new skill multiplies all existing ones

### Aviz Demo: Working with Skill Stacks (20 min)
- **Real workflow, not toy example**
- Show Aviz's actual skill list (50+ skills)
- Pick 2-3 real use cases and execute live:
  - Example 1: "Create a marketing poster for tomorrow's workshop" → research + design + generate
  - Example 2: "Send follow-up to all workshop participants" → CRM + personalize + WhatsApp
  - Example 3: "Prepare invoice for client X" → get-contact + create-invoice + send-email
- Show the speed difference: with stacks vs without
- The "aha moment": this is what compounding looks like in practice

### Wrap-up + Homework (10 min)
- Recap: skill = capability, stack = power, compounding = exponential
- **Homework:**
  - Continue your project — create at least 2 more skills
  - Think about which tasks repeat → those are skill candidates
  - Try connecting 2 skills into a mini-stack
  - Enrich your CLAUDE.md with what you learned
- Preview session 3: "You've been building skills and projects. Next time — discover that what you built IS an application."

## Participant Prompts (Ready to Copy-Paste)

```
תהפוך את מה שעשינו עכשיו לסקיל
```

```
צור לי סקיל שעושה [תיאור המשימה]
```

```
תראה לי את כל הסקילים שיש לי
```

```
תחבר את הסקיל של [X] עם הסקיל של [Y] לתהליך אחד
```

## Open Questions
- Do we provide a "starter skill" template for participants who get stuck?
- Should we do a live VS Code demo or just mention it?
- How much time to allocate for troubleshooting participants who didn't complete homework?
