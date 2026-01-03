# Architect Workshops

This repository manages workshops by **Aviz - The Architect** - educational tech workshops delivered in Hebrew via Zoom.

## Project Overview

- **Brand:** Aviz - The Architect
- **Language:** Hebrew (עברית)
- **Platform:** Zoom webinars, typically Thursday evenings at 20:00
- **Marketing:** WhatsApp groups, Facebook communities
- **Style:** Professional, educational, tech-forward with green (#22C55E) accent colors

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

## Brand Assets

### Avatars

| Avatar | File | Use For |
|--------|------|---------|
| **Boss Avatar** | `.claude/skills/nano-banana-poster/references/avatar-boss.png` | Workshop posters - professional 3D character in dark suit with green tie. Use for powerful, aspirational imagery (sitting on throne, money flying, etc.) |
| **Original Avatar** | `.claude/skills/nano-banana-poster/references/avatar.jpg` | General use |

### Other Assets

- **Gallery:** `.claude/skills/nano-banana-poster/assets/gallery/` (reference posters)
- **Colors:** Green (#22C55E), gray tones, professional tech aesthetic
