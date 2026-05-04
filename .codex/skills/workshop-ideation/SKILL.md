---
name: workshop-ideation
description: "Brainstorm and add new workshop ideas to the ideas backlog. Use when the user wants to 'add a workshop idea', 'brainstorm topics', 'suggest new workshops', or discuss potential workshop concepts before committing to creation."
---

# Workshop Ideation

Brainstorm workshop ideas through discussion and add them to `workshop-ideas.md`.

## Workflow

### 1. Start the Conversation

Read current ideas to avoid duplicates:
```bash
cat /Users/aviz/architect-workshops/workshop-ideas.md
```

Ask open-ended questions:
- "What area interests you? (AI tools, coding, automation, business...)"
- "Who's the target audience? (beginners, developers, business people...)"
- "Any specific pain point or skill you want to teach?"

### 2. Brainstorm Together

Based on user input, suggest 2-3 concrete ideas. For each:
- **Topic name** (Hebrew preferred, can be mixed with English for tech terms)
- **One-line description** (Hebrew)
- **Why it would resonate** with the audience

Example:
> "Based on your interest in automation, here are some ideas:
> 1. **אוטומציה עם Make.com** - בניית תהליכים אוטומטיים ללא קוד
> 2. **Zapier למתחילים** - חיבור אפליקציות בקלות
>
> Which resonates? Or should we explore a different direction?"

### 3. Refine the Idea

Once user picks a direction, define:

| Field | Required | Example |
|-------|----------|---------|
| Topic | Yes | Claude Code למתחילים |
| Description | Yes | שימוש ב-Claude Code בטרמינל לפיתוח מהיר |
| Level | Yes | Beginner / Intermediate / Advanced |
| Duration | Yes | 2 hours |
| Status | Auto | Available |

### 4. Confirm and Add

Show the final row before adding:
```
| Claude Code למתחילים | שימוש ב-Claude Code בטרמינל לפיתוח מהיר | Intermediate | 2 hours | Available |
```

Ask: "Add this to the ideas list?"

If confirmed, append to the table in `workshop-ideas.md`.

### 5. Next Steps

After adding, ask:
- "Want to brainstorm another idea?"
- "Ready to create a workshop from this idea?" (→ use `workshop-creator` skill)

## Brainstorming Prompts

Use these to spark ideas:

**By audience:**
- "What do non-technical people struggle with in AI?"
- "What would help developers be more productive?"
- "What would business owners pay to learn?"

**By trend:**
- "What's new in AI this month?"
- "What tools are people asking about?"

**By pain point:**
- "What repetitive task could be automated?"
- "What skill gap do you see in your community?"

## Notes

- Keep descriptions concise (under 50 characters)
- Hebrew is preferred for topic names and descriptions
- English is fine for technical terms (e.g., "Claude Code", "MCP")
- Don't add duplicates - check existing ideas first
