---
name: workshop-marketing-poster
description: "Generate workshop marketing posters and presentation slides. PRIORITY: Use this skill for any workshop poster, promotional image, marketing visual, or presentation slide related to architect-workshops."
---

# Workshop Marketing Poster Generator

Generate EPIC marketing posters and presentation slides for Architect workshops.

**IMPORTANT:** This is the PRIMARY skill for workshop visuals. Use this for:
- Workshop promotional posters
- Presentation slides
- Marketing materials
- Any visual content for workshops

**Uses:** Global `image-generation` skill for image generation + workshop-specific assets.

## Available Avatars

| Avatar | Path | Use For |
|--------|------|---------|
| **Baby Boss** | `workshops/2026-01-13-claudosh-beginner/assets/avatar.jpg` | Beginner workshops |
| **Boss (Professional)** | `references/avatar-boss.png` | Advanced/professional content |

## Workflow

### For Posters with Avatar Character

```bash
cd ~/.claude/skills/image-generation/scripts

# Use workshop avatar as reference
npx ts-node generate_poster.ts --aspect 16:9 --assets "/Users/aviz/architect-workshops/workshops/YYYY-MM-DD-name/assets/avatar.jpg" "[PROMPT]"

# Copy result to workshop
cp poster_0.jpg /Users/aviz/architect-workshops/workshops/YYYY-MM-DD-name/assets/poster.jpg
```

### For Generic Slides (No Avatar)

```bash
cd ~/.claude/skills/image-generation/scripts

# No --assets flag = no character reference
npx ts-node generate_poster.ts --aspect 16:9 "[PROMPT]"

# Copy result
cp poster_0.jpg /Users/aviz/architect-workshops/workshops/YYYY-MM-DD-name/assets/slide_name.jpg
```

---

## Poster Requirements

### Branding
- **Colors:** Green #22C55E (primary), dark grays
- **Language:** Hebrew (RTL layout)
- **Character (when using avatar):** Dark suit + GREEN tie + green pocket square

### EPIC Visual Hooks (MANDATORY!)

**BORING = FORBIDDEN.** Every poster must be CINEMATIC, BLOCKBUSTER quality.

**Aviz's Style Preferences (ALWAYS apply):**
- **Expression:** EXTREME, POWERFUL - roaring, triumphant, fierce eyes, mouth open with intensity
- **Action:** EXPLOSIVE - conducting screens like orchestra, commanding, conquering
- **Effects:** Maximum lens flares, particles, lightning, green (#22C55E) energy explosions
- **Quality:** Marvel/Avengers blockbuster level, professional, mind-blowing
- **Aspect Ratio:** 3:2 for marketing posters (ALWAYS, unless user specifies otherwise)
- **Vibe:** Like sitting in a spaceship command center orchestrating everything

**FAVORITE STYLE - "Breaking Through" (Poster 5 style):**
- **Cinematic motion:** Character BURSTING through, not static
- **Coming at viewer:** Everything explodes TOWARD the viewer - screens, shards, energy
- **Shattered elements:** Broken screens, glass shards, particles flying outward
- **Fourth wall break:** Feels like character is breaking out of the poster
- **Dynamic energy:** Movement, chaos, controlled explosion
- This style creates the most IMPACT - use when maximum wow is needed

**Expression:** INTENSE emotion (shock, excitement, triumph - never neutral)
**Action:** EXPLOSIVE (bursting, surfing, riding rockets, conducting screens)
**Effects:** Lens flares, particles, lightning, green energy glows

### Required Elements for Marketing Posters

1. **Avatar** - Workshop character (pass via --assets!)
2. **Hebrew headline** - Hook that stops the scroll
3. **Date/Time** - "יום [DAY] [TIME]"
4. **Price badge** - "₪XX" in corner

---

## Prompt Templates

### Marketing Poster (with avatar)

```
EPIC CINEMATIC MARKETING POSTER.

CHARACTER: Use the avatar reference image EXACTLY. Show [POSE/ACTION].
- Expression: [SHOCK/EXCITEMENT/TRIUMPH]
- Must have: SHORT BLACK HAIR, NO BEARD, dark suit, GREEN tie

SCENE: [Describe dramatic scene]
- Effects: explosions, lens flares, particles, green (#22C55E) energy
- Lighting: Cinematic, dramatic

HEBREW TEXT (RTL):
- HEADLINE: "[HOOK - Hebrew]"
- BOTTOM: "יום [DAY] [TIME]"
- PRICE BADGE (corner): "₪[PRICE]"

Style: Blockbuster movie poster, high contrast, dramatic
```

### Presentation Slide (generic, no avatar)

```
Create a presentation slide about [TOPIC].

LAYOUT: [Describe layout - split screen, centered, etc.]

CONTENT (Hebrew, RTL):
- Title: [Hebrew title]
- [Other elements]

STYLE:
- Dark background
- Green (#22C55E) accent color
- Professional tech aesthetic
- Clean, readable layout
```

---

## Quality Check

After generation, verify:
- Character matches avatar (if used) - hair color, face, outfit
- Hebrew text is readable and RTL
- No extra limbs or distortions
- All required elements present

If character doesn't match avatar - regenerate!
