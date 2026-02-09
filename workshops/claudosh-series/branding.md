# Claudosh Series - Branding Guide

## Brand Identity

| Element | Value |
|---------|-------|
| **Series Name (Hebrew)** | סידרת קלודוש |
| **Series Name (English)** | Claudosh Series |
| **Tagline** | מאפס למערכת הפעלה אישית |
| **Price** | ₪297 לסידרה המלאה |
| **Sessions** | 3 (every display must show X/3) |

---

## Sessions

| # | Hebrew Name | English Name | Subtitle | Emoji |
|---|-------------|-------------|----------|-------|
| 1/3 | השיגור | Launch | למתחילים | 🚀 |
| 2/3 | מצב חללית | Spaceship Mode | למתקדמים | 🛸 |
| 3/3 | אפס כבידה | Zero Gravity | לאסטרונאוטים | 🌌 |

### Session Core Concepts (What We Actually Learn)

| Session | Core Concept | The Shift | Visual Metaphor |
|---------|-------------|-----------|-----------------|
| **השיגור** | Breaking the window - exit the tab/window flow. One agent runs a full task sequence for you. | From copy-pasting between tabs → one agent handling the chain | Shattering a browser window, stepping through to the other side |
| **מצב חללית** | Multiple windows, multiple projects. Agent works across screens/projects simultaneously. | From single-task → multi-project parallel work on computer | Sitting at a multi-screen workstation, holographic windows surrounding you |
| **אפס כבידה** | Swarm control from WhatsApp. Leave the computer. Manage agent swarm from phone. | From sitting at computer → floating free, phone-only control | Floating in zero gravity, phone in hand, agent swarm orbiting like satellites |

### The Progression

```
Session 1: You → [one agent] → task chain
Session 2: You at computer → [agent across projects] → parallel work
Session 3: You on phone → [agent swarm] → autonomous execution
```

**The risk escalation:** Each session requires more trust in the agents. Session 3 = letting go of the keyboard entirely.

---

## Visual Language

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Signature Green** | `#22C55E` | Energy, lightning, badges, accents |
| **Deep Space Black** | `#0A0A0A` | Backgrounds |
| **Dark Gray** | `#1A1A1A` | Title bar gradient |
| **White** | `#FFFFFF` | Title text, body text |

### Character

The **Boss Avatar** - 3D character in dark suit with green tie, beard. Same character across all materials, evolving pose:

| Session | Pose | Setting |
|---------|------|---------|
| השיגור | Standing, helmet in hand, walking forward | Space station, rocket launch behind |
| מצב חללית | Hands raised, conducting/commanding | Spaceship bridge, holographic screens |
| אפס כבידה | Floating cross-legged, phone in hand | Above Earth, zero gravity, screens orbiting |

**Reference file:** `.claude/skills/workshop-marketing-poster/references/avatar-boss.png`

### Effects & Atmosphere

Every poster must include:
- **Shattering glass fragments** - breaking through boundaries
- **Green (#22C55E) energy/lightning** - connecting elements
- **Volumetric fog/lighting** - cinematic depth
- **Lens flares** - dramatic highlight moments
- **Particle effects** - sparks, debris, energy
- **Deep shadows** - contrast and drama

### Typography Layout (Consistent Across All)

```
┌─────────────────────────────────┐
│                   סידרת קלודוש  │  ← top-right, smaller
│                                 │
│         [CHARACTER + SCENE]     │
│                                 │
│  ┌──────┐                       │
│  │ ₪297 │    [SESSION TITLE]    │  ← large bold Hebrew, bottom-center
│  │לסידרה│   מפגש X/3 | ל[קהל]  │  ← subtitle below
│  └──────┘                       │
└─────────────────────────────────┘
```

- **Title:** Large bold Hebrew, bottom-center
- **Subtitle:** `מפגש X/3 | ל[audience]` below title
- **Series name:** `סידרת קלודוש` top-right corner
- **Price badge:** Green badge, bottom-left, `₪297 לסידרה המלאה`

### Strict Rules

1. **NO ENGLISH TEXT** - absolutely zero English words in any poster
2. **RTL layout** - all Hebrew text flows right-to-left
3. **Consistent title placement** - always bottom-center, same style
4. **Same character** - always the Boss Avatar, same face/suit
5. **Green energy** - must appear in every visual
6. **Price always includes** "לסידרה המלאה" to clarify it's for full series

---

## Triptych (Combined Poster)

The combined poster shows all 3 sessions side by side in a wide format (16:9):

```
┌──────────────┬──────────────┬──────────────┐
│   אפס כבידה  │  מצב חללית   │   השיגור     │  ← RTL: right = session 1
│   (3/3)      │   (2/3)      │   (1/3)      │
└──────────────┴──────────────┴──────────────┘
         סידרת קלודוש (top center)
  ₪297 לסידרה המלאה | 3 מפגשים (bottom)
```

- Continuous background flowing across panels
- Green energy threads connecting all 3
- Thin green glowing dividers between panels

---

## Asset Inventory (V3 Final)

| File | Type | Aspect | Resolution |
|------|------|--------|------------|
| `poster-v3-1-launch.jpg` | Session 1 poster | 3:2 | 2K |
| `poster-v3-2-spaceship.jpg` | Session 2 poster | 3:2 | 2K |
| `poster-v3-3-zerog.jpg` | Session 3 poster | 3:2 | 2K |
| `poster-v3-series-combined.jpg` | Triptych | 16:9 | 2K |

**Gallery copies:** `~/.claude/skills/workshop-marketing-poster/assets/gallery/claudosh-series-*.jpg`

---

## Prompt Template

When generating new materials for this series, use this base prompt structure:

```
CRITICAL: Layout is RTL (right-to-left). All text in Hebrew.
DO NOT include any English words or letters whatsoever.

[Character and scene description using Boss Avatar reference]

Green (#22C55E) energy signature throughout. Shattering glass fragments,
volumetric fog, dramatic rim lighting, lens flares, particle effects.

BOTTOM SECTION - clean dark gradient bar:
- Title: [SESSION NAME] (large, bold, centered)
- Subtitle: מפגש [X]/3 | ל[audience]
- Top right: סידרת קלודוש
- Bottom left: green badge ₪297 לסידרה המלאה

Style: Ultra-cinematic, deep shadows, volumetric lighting, anamorphic lens,
green energy, 8K detail, dramatic depth of field.
```

Always use `poster-v3-1-launch.jpg` as a **style reference** (`--assets`) to maintain visual consistency across new materials.

---

## Social Media Formats

| Platform | Aspect | Notes |
|----------|--------|-------|
| Facebook/Instagram post | 1:1 | Crop to square, keep title visible |
| Instagram story | 9:16 | Vertical, character fills frame |
| Facebook cover | 16:9 | Use triptych or single session |
| WhatsApp status | 9:16 | Vertical crop |
| YouTube thumbnail | 16:9 | Triptych or single with text overlay |
