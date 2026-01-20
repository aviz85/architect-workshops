# Architect Workshops

This repository manages workshops by **Aviz - The Architect** - educational tech workshops delivered in Hebrew via Zoom.

## Documentation Language Rule

**All documentation, skills, and commands must be written in English**, except for:
- Workshop content delivered to participants (agenda items, slide text)
- Marketing materials and messages (WhatsApp, Facebook posts)
- Hebrew phrases in templates that go to end users
- Workshop titles and topic names

This keeps the codebase consistent and maintainable while allowing Hebrew where it matters - the actual content.

## Auto-Commit Rule

**Commit and push after every change.** Don't batch changes - each meaningful edit gets its own commit immediately.

## Project Overview

- **Brand:** Aviz - The Architect
- **Language:** Hebrew (עברית)
- **Platform:** Zoom webinars, typically Thursday evenings at 20:00
- **Marketing:** WhatsApp groups, Facebook communities
- **Style:** Professional, educational, tech-forward with green (#22C55E) accent colors

---

## Proactive Workshop Reminders (IMPORTANT)

**At the start of EVERY conversation**, Claude should:

1. Check today's date and time
2. Scan `workshops/*/workshop.md` for upcoming/recent workshops
3. Remind the user about relevant procedures based on timing

### Procedure Timeline

| Timing | Procedure | Command/Action |
|--------|-----------|----------------|
| **1 week before** | Marketing push - poster, publish to groups | `/nano-banana-poster`, `/social-publisher` |
| **3-4 days before** | Reminders in groups, sneak peeks | `workshop-updates` |
| **2 days before** | Final prep - presentation ready? POC ready? | Check pipeline status |
| **Day of (morning)** | Pre-live checklist, final prep | `/live-prep` |
| **1 hour before** | Clean desktop, open Zoom | `/live-prep` |
| **Immediately after** | Document metrics, hot impressions | `/workshop-end` |
| **1-2 days after** | Thank you poster, follow-up | `/workshop-thank-you` |
| **1 week after** | Collect testimonials, transcript | `workshop-updates` |

### How to Check

```bash
# List workshops by date
ls workshops/ | grep -E "^[0-9]{4}-[0-9]{2}-[0-9]{2}"
```

Then compare with today's date and alert the user:

**Example reminders:**

> "Today is 2026-01-13 - you have a workshop today at 21:00!
> Want to run `/live-prep` to prepare?"

> "Yesterday's workshop (2026-01-12) - have you run `/workshop-end` to document?"

> "Workshop in 3 days (2026-01-16) - is poster and marketing ready?"

### Reminder Priority

1. **Day of workshop** - TOP PRIORITY - remind immediately!
2. **Day after workshop** - remind about `/workshop-end` if not run
3. **2 days before** - check everything is ready
4. **1 week before** - push marketing if not started

---

## Workshop Lifecycle

### 1. Ideation (`workshop-ideation` skill)
- Brainstorm new ideas through guided discussion
- Add ideas to `workshop-ideas.md` backlog
- Topics range from AI tools, coding assistants, automation, to business applications

### 2. Creation (`workshop-creator` skill)
- Create folder structure: `workshops/YYYY-MM-DD-topic/`
- Generate `workshop.md` with logistics, agenda, and pipeline tracking
- Set up WhatsApp group, Zoom link

### 3. Marketing (`nano-banana-poster` skill)
- Generate promotional posters with brand consistency
- Use avatar and brand assets from `image-references/` or skill references
- Post to WhatsApp groups, Facebook communities

### 4. Presentation (`presentation-architect` skill)
- Create detailed presentation blueprint (`presentation-plan.md`)
- Review content outline with user before full creation
- User creates actual slides via **NotebookLM Studio**

### 5. Delivery & Follow-up (`workshop-updates` skill)
- Track attendance metrics
- Collect testimonials
- Add transcripts and summaries

## Folder Structure

```
architect-workshops/
├── CLAUDE.md                 # This file - project instructions
├── workshop-ideas.md         # Topic backlog
├── image-references/         # Global brand assets (avatar, logo)
├── future-concepts/          # Detailed concepts not yet scheduled
│   └── concept-name.md       # In-depth workshop concept
├── workshops/
│   ├── example/              # Template workshop
│   └── YYYY-MM-DD-topic/     # Individual workshops
│       ├── workshop.md
│       ├── presentation-plan.md
│       └── assets/
└── .claude/skills/           # Automation skills
    ├── workshop-creator/
    ├── workshop-updates/
    ├── nano-banana-poster/
    ├── presentation-architect/
    └── whatsapp-*/
```

### Future Concepts Folder

The `future-concepts/` folder contains detailed workshop concepts that are:
- More developed than a single line in `workshop-ideas.md`
- Not yet scheduled for a specific date
- Include full agenda, target audience, POC ideas
- Marked as "Concept" status in the ideas table

When ready to schedule, move concept content to a new workshop folder in `workshops/`.

## Available Skills

| Skill | Purpose |
|-------|---------|
| `workshop-ideation` | Brainstorm and add ideas to backlog |
| `workshop-creator` | Create new workshop with folder structure |
| `workshop-updates` | Track pipeline progress, attendance, follow-ups |
| `nano-banana-poster` | Generate promotional posters |
| `presentation-architect` | Create presentation blueprints |
| `whatsapp-group-info` | Get WhatsApp group details |
| `whatsapp-send-message` | Send messages to participants |

## Presentation Requirements (Hebrew/RTL)

All workshop presentations must follow these rules:

- **Content in Hebrew** - All slide text in Hebrew
- **RTL Layout** - Right-to-left flow on every slide
- **Markdown plan header:**
  ```
  **Language:** Hebrew (עברית)
  **Layout Direction:** RTL (Right-to-Left)
  ```
- **Per-slide:** Include `**Direction:** RTL - content flows from right to left`

### Creating Slides from Plan

1. Create `presentation-plan.md` using the skill
2. Open [NotebookLM Studio](https://notebooklm.google.com/)
3. Upload the plan file
4. Ask NotebookLM to implement exactly as written
5. Save final slides to `assets/slides.pdf`

## Quick Commands

### Workshop Management Commands

```bash
# End of broadcast - document metrics and impressions
/workshop-end

# 1-2 days after - thank you poster and follow-up
/workshop-thank-you

# Pre-broadcast prep - clean desktop
/live-prep
```

### Skills (contextual, come up during work)

```bash
# Brainstorm new workshop ideas
/workshop-ideation

# Create a new workshop
/workshop-creator

# Update workshop progress
/workshop-updates

# Generate a poster
/nano-banana-poster

# Create presentation blueprint
/presentation-architect
```

### Command vs Skill

| Type | When | Examples |
|------|------|----------|
| **Command** | Clear trigger point - "I need to do X now" | `/workshop-end`, `/live-prep` |
| **Skill** | Comes up during flow of other work | `workshop-updates`, `nano-banana-poster` |

## Brand Assets

### Avatars

| Avatar | File | Use For |
|--------|------|---------|
| **Boss Avatar** | `.claude/skills/nano-banana-poster/references/avatar-boss.png` | Workshop posters - professional 3D character in dark suit with green tie. Use for powerful, aspirational imagery (sitting on throne, money flying, etc.) |
| **Original Avatar** | `.claude/skills/nano-banana-poster/references/avatar.jpg` | General use |

### Other Assets

- **Gallery:** `.claude/skills/nano-banana-poster/assets/gallery/` (reference posters)
- **Colors:** Green (#22C55E), gray tones, professional tech aesthetic
