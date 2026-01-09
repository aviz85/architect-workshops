---
name: nano-banana-poster
description: "Generate workshop marketing posters. Use for: create poster, promotional image, workshop visual."
---

# Workshop Poster Generator

Generate marketing posters for Architect workshops using the `nano-banana-image` skill with workshop branding.

## Branding (MANDATORY)

**Brand:** Aviz - The Architect
**Mission:** Teaching non-tech people to code with AI
**Language:** ALL text MUST be in Hebrew

**Colors:**
- Primary: #22C55E (Friendly Green)
- Grays: #374151, #4B5563, #6B7280, #9CA3AF
- Secondary Greens: #16A34A, #158235, #166534

**Style:** Professional, educational, tech-forward

## Avatar Options

| Avatar | File | Use For |
|--------|------|---------|
| **Boss Avatar** | `references/avatar-boss.png` | Power poses - throne, money flying, confident smirk |
| **Baby Boss** | See `references/avatar-baby-boss-character-sheet.md` | Cute but powerful imagery |
| **Original** | `references/avatar.jpg` | General marketing |

## Visual Hooks (CRITICAL)

Avatar must NEVER be static. Always show exciting action:

- Surfing on code waves
- Conducting orchestra of floating screens
- Riding rocket of AI symbols
- Opening glowing treasure chest
- Standing on mountain of tech, arms raised

**Formula:** `AVATAR + DRAMATIC ACTION + TOPIC = ATTENTION`

## Commands

```bash
cd /Users/aviz/architect-workshops/.claude/skills/nano-banana-poster/scripts

# With avatar
npx ts-node generate_poster.ts --assets "avatar" "prompt"

# With boss avatar (edit script line ~53 to use avatar-boss.png)
npx ts-node generate_poster.ts --assets "avatar" "prompt"

# Save to gallery
npx ts-node generate_poster.ts --save-to-gallery "workshop-name" --assets "avatar" "prompt"
```

## Price Badge (MANDATORY)

**Every poster MUST include a price badge:**
- Shape: Circle/badge in corner (preferably top-left or bottom-right)
- Color: Bright, eye-catching (yellow, orange, or green accent)
- Format: "₪XX" or "XX ש״ח"
- Style: Looks like a sale sticker / price tag

**Example prompt addition:**
```
Include a bright price badge in the corner showing "₪50" like a sale sticker.
```

## Prompt Template

```
Create workshop poster for "[WORKSHOP TITLE]".

CRITICAL: ALL text in Hebrew.
CRITICAL: Layout direction is RTL (right-to-left).

Brand: Aviz - The Architect
Colors: #22C55E green, grays #374151, #4B5563
Style: Professional, educational, tech-forward

Workshop: [Title], יום [DAY] [TIME], Zoom
Price: Include bright price badge showing "₪[PRICE]" in corner like a sale sticker.

Avatar action: [WHAT IS AVATAR DOING - be dramatic!]
```

## Auto-Copy to Workshop

**ALWAYS copy generated poster to workshop folder:**

```bash
cp poster_0.jpg ../../../../../../workshops/YYYY-MM-DD-workshop-name/assets/poster.jpg
```

## Asset Locations

Script searches (first match wins):
1. `/image-references/` - Repo root
2. `references/` - Skill folder (avatars here)
3. `assets/gallery/` - Previous posters for style reference
