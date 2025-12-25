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
| **Time** | Optional | Start time (HH:MM) |
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
> "What date is the workshop? Do you have a topic in mind, or should I suggest from the ideas list?"

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

## Folder Structure Created

```
workshops/
└── YYYY-MM-DD-topic/
    ├── workshop.md      # Main workshop document
    └── assets/          # Posters, slides, materials
        └── .gitkeep
```

## Notes

- Always use date in folder name for easy sorting
- Topic slug should be lowercase, hyphenated (e.g., `claude-code-intro`)
- Hebrew content is fine in the markdown file
- Unfilled fields should keep placeholder format `[Description here]`
- Commit changes after creating workshop
