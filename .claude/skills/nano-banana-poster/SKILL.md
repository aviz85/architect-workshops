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

## Workshop Info (MANDATORY - READ FIRST!)

**Before creating ANY workshop poster, ALWAYS read the workshop.md file to get:**

```bash
# Read workshop info first!
cat workshops/YYYY-MM-DD-workshop-name/workshop.md
```

**Extract and include:**
| Info | Where to Find | Use In Poster |
|------|---------------|---------------|
| **Title** | `## Logistics` table | Main headline |
| **Date** | `## Logistics` table | "יום [DAY]" text |
| **Time** | `## Logistics` table | "[TIME]" text |
| **Price** | `## Logistics` table | Price badge "₪XX" |
| **Avatar** | `assets/avatar.jpg` | Character in poster (character sheet image) |

## Avatar System (IMPORTANT!)

**Avatar = CHARACTER SHEET IMAGE** - A single image showing the character from multiple angles on black background.

### Avatar Search Order

When creating a poster, search for avatar in this order:

1. **Workshop-specific:** `workshops/YYYY-MM-DD-name/assets/avatar.jpg` (FIRST PRIORITY)
2. **Skill references:** `references/avatar-boss.png` (fallback for adult boss)
3. **Skill default:** `references/avatar.jpg` (last resort)

### How to Use Avatar in Poster Generation

```bash
cd ~/.claude/skills/nano-banana-image/scripts

# Copy workshop avatar to references folder temporarily (or use --assets flag if supported)
cp /path/to/workshop/assets/avatar.jpg references/avatar-workshop.jpg

# Generate poster - the script auto-loads avatar from references
npx ts-node generate_poster.ts "[POSTER PROMPT]"
```

### Available Character Types

| Type | Description | Workshop Use |
|------|-------------|--------------|
| **Boss** | Adult professional, beard, confident | Advanced/technical workshops |
| **Baby Boss** | Baby version, cute but powerful | Beginner/intro workshops |
| **Custom** | User-defined character | Special themes |

**All characters MUST have:** Dark suit + GREEN TIE (#22C55E) + green pocket square

## Visual Hooks (CRITICAL - EPIC LEVEL REQUIRED)

**BORING POSTERS ARE FORBIDDEN!** Every poster must be EPIC, CINEMATIC, BLOCKBUSTER quality.

### Avatar Expression (MANDATORY)
Avatar must show INTENSE EMOTION - never neutral or calm:
- 😱 **SHOCK/AWE** - Jaw dropped, eyes wide, mind blown
- 🤩 **EXCITEMENT** - Huge smile, fist pump, celebrating
- 😤 **DETERMINATION** - Intense focus, ready for action
- 🎉 **TRIUMPH** - Victory pose, arms raised, ecstatic

### Action Level (MAXIMUM)
Avatar must NEVER be static. Show EXPLOSIVE action:
- **BURSTING** through walls of screens, shattering them
- **SURFING** on massive waves of code and data
- **RIDING** rockets through space with flames and sparks
- **CONDUCTING** an orchestra of flying holographic interfaces
- **OPENING** treasure chest with prizes EXPLODING out
- **LAUNCHING** from spaceship cockpit into AI vortex

### Visual Effects (GO BIG)
Every poster needs DRAMATIC visual elements:
- Explosions, lens flares, particle effects
- Lightning bolts, speed lines, motion blur
- Flying money, confetti, fireworks
- Holographic screens with charts "going to the moon"
- Green (#22C55E) energy glows and data streams
- Dramatic cinematic lighting with shadows

**Formula:** `AVATAR + INTENSE EMOTION + EXPLOSIVE ACTION + DRAMATIC EFFECTS = SCROLL-STOPPING POSTER`

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

## Headlines (NO BORING HEADLINES!)

**Headlines must be HOOKS that stop the scroll!**

### Bad Headlines (NEVER USE):
- ❌ "סדנת AI" (too generic)
- ❌ "למד קלוד קוד" (boring)
- ❌ "הצטרפו לסדנה" (weak CTA)

### Good Headlines (USE THESE PATTERNS):
- ✅ "זה לא מה שחשבת על AI" (curiosity hook)
- ✅ "העובד שעובד בשבילך 24/7" (benefit hook)
- ✅ "הכל השתנה ב-2026" (news hook)
- ✅ "ההזדמנות האחרונה לקפוץ" (urgency hook)
- ✅ "מה שהם לא רוצים שתדע" (secret hook)

### Text Layers (MANDATORY)
Every poster needs MULTIPLE text elements:
1. **Main Headline** - The HOOK (biggest, boldest)
2. **Subheadline** - Supporting benefit
3. **Date/Time** - "יום שלישי 21:00"
4. **Price Badge** - "₪50" sticker style
5. **CTA hint** - "קישור בתגובה 👇" (optional)

## Prompt Template (EPIC VERSION)

```
EPIC CINEMATIC MARKETING POSTER for workshop "[TITLE]"

CHARACTER: [Use workshop's avatar.png - describe character]
- Expression: [SHOCK/AWE/EXCITEMENT/TRIUMPH - be specific!]
- Action: [BURSTING/SURFING/RIDING/LAUNCHING - be dramatic!]

SCENE: [Describe explosive action scene with effects]
- Visual effects: explosions, lens flares, particles, lightning
- Background: dramatic lighting, green (#22C55E) glows, tech elements
- Energy: MAXIMUM - this is a blockbuster movie poster!

HEBREW TEXT (RTL Layout):
- MAIN HEADLINE (top, huge, bold): "[HOOK HEADLINE]"
- SUBTEXT (bottom): "יום [DAY] [TIME] | [BENEFIT]"
- PRICE BADGE (corner, sticker style): "₪[PRICE]"

Style: Cinematic, high contrast, dramatic shadows, lens flares
Colors: Green #22C55E accents, dark background, golden highlights
```

## Quality Check (MANDATORY!)

**After EVERY poster generation, LOOK AT THE IMAGE to check for:**
- ❌ Wrong number of limbs (3 hands, extra fingers, etc.)
- ❌ Distorted faces or bodies
- ❌ Text rendering issues
- ❌ Missing or broken elements

**Rules:**
1. **Always view** the generated poster before sending to user
2. **Maximum 2 attempts** per poster - if still bad after 2 tries, send the best one and note issues
3. **Don't loop forever** - AI image generation isn't perfect, move on after 2 attempts
4. **Report issues** - Tell user if you noticed any artifacts

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
