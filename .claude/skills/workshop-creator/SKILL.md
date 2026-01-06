---
name: workshop-creator
description: "Create a new workshop with folder structure and content. Use when the user asks to 'create a workshop', 'plan a new workshop', 'add a workshop', or wants to set up a new workshop session."
---

# Workshop Creator

Create new workshops with proper folder structure and documentation.

## Required & Optional Fields

| Field | Required | Description |
|-------|----------|-------------|
| **Date** | ✅ Required | Workshop date (YYYY-MM-DD format) |
| **Topic** | ⭐ Recommended | Workshop topic/title |
| **Time** | ✅ Required | Start time (HH:MM) - ALWAYS ask for this! |
| **Duration** | Optional | Length of workshop |
| **WhatsApp Link** | Optional | Group invitation link |
| **WhatsApp Group ID** | Optional | Green API group ID (format: xxxxx@g.us) |
| **Zoom Link** | Optional | Meeting URL |
| **Overview** | Optional | Workshop description |

## Workflow

### 1. Collect Information

Ask the user for workshop details. **Date is required**, topic is recommended.

If user doesn't have a topic, suggest ideas from `/workshop-ideas.md`:
```bash
cat /home/user/architect-workshops/workshop-ideas.md
```

Example prompt:
> "What date and time is the workshop? (Date required, Time required - e.g., 21:00). Do you have a topic in mind, or should I suggest from the ideas list?"

**CRITICAL: Always confirm the exact time with the user. Default is 21:00 but MUST be verified.**

### 2. Create Workshop Folder

Create the workshop folder using the date (and optionally topic):

```bash
# Format: YYYY-MM-DD or YYYY-MM-DD-topic-slug
mkdir -p /home/user/architect-workshops/workshops/YYYY-MM-DD/assets
```

Example:
```bash
mkdir -p /home/user/architect-workshops/workshops/2025-01-15-claude-code-intro/assets
touch /home/user/architect-workshops/workshops/2025-01-15-claude-code-intro/assets/.gitkeep
```

### 3. Create Workshop File

Copy and fill the template from the example:

```bash
cp /home/user/architect-workshops/workshops/example/workshop.md /home/user/architect-workshops/workshops/YYYY-MM-DD/workshop.md
```

Then edit the file to fill in the collected details. Leave unknown fields with placeholder text for later.

### 4. Update Workshop Ideas (if applicable)

If the workshop topic came from `workshop-ideas.md`, update its status to "Planned".

### 5. Offer Poster Creation

After creating the workshop, ask if the user wants to generate a promotional poster using the `nano-banana-poster` skill.

### 6. Offer Presentation Creation

After discussing the poster, offer to create a presentation script using the `presentation-architect` skill.

**Workflow for presentation creation:**
1. **Gather content first** - Based on the workshop topic, overview, and agenda, prepare a content outline
2. **Review with user** - Present the proposed content structure to the user and ask for feedback/changes before proceeding
3. **Create presentation** - Once approved, invoke the `presentation-architect` skill with the workshop-specific requirements

**Workshop Presentation Requirements (CRITICAL):**
- The presentation **content must be in Hebrew** (the actual text on slides)
- The markdown plan file can be in English, but must specify that all content should be in Hebrew
- **RTL (Right-to-Left) layout is mandatory** - every slide must specify RTL flow direction
- Add this note at the top of the presentation plan: `**Language:** Hebrew | **Layout Direction:** RTL (Right-to-Left)`
- For each slide, include: `**Direction:** RTL - content flows from right to left`

**Example prompt for presentation-architect:**
> "Based on the workshop content, create a presentation plan. Remember: all slide content must be in Hebrew, and every slide must use RTL layout (right-to-left flow)."

**Creating the actual slides (user manual step):**
After the presentation plan is saved, inform the user:
> "The presentation plan is ready at `presentation-plan.md`. To create the actual slides, open NotebookLM Studio, upload this file, and ask it to implement the presentation exactly as described."

## Example Interaction

**User:** "Create a new workshop"

**Assistant:**
1. "What date is the workshop? (Required, format: YYYY-MM-DD)"
2. "What's the topic? I can suggest from the ideas list if you're not sure."
3. "Any other details you want to add now? (time, WhatsApp group, Zoom link, etc.)"

**After collecting:**
1. Create folder: `workshops/2025-01-20-ai-intro/`
2. Create `workshop.md` with filled details
3. Create `assets/` subfolder
4. Ask: "Workshop created! Want me to generate a poster for it?"
5. After poster discussion: "Would you like me to create a presentation for this workshop? I'll first show you a content outline for your review before creating the full presentation plan."

**If user wants presentation:**
1. Present content outline based on workshop details
2. Wait for user approval/changes
3. Create presentation using `presentation-architect` skill with Hebrew content and RTL layout

## Folder Structure Created

```
workshops/
└── YYYY-MM-DD-topic/
    ├── workshop.md              # Main workshop document
    ├── presentation-plan.md     # Presentation blueprint (if created)
    └── assets/                  # Posters, slides, materials
        └── .gitkeep
```

## Notes

- Always use date in folder name for easy sorting
- Topic slug should be lowercase, hyphenated (e.g., `claude-code-intro`)
- Hebrew content is fine in the markdown file
- Unfilled fields should keep placeholder format `[Description here]`
- Commit changes after creating workshop
