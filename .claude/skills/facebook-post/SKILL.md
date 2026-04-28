---
name: facebook-post
description: Turn a raw Hebrew idea/draft from Aviz into a publish-ready Facebook post. Restructures into paragraphs (single blank line between each), preserves his voice ("less hype, more practical"), copies the final body to clipboard via pbcopy, and saves to content/posts/YYYY-MM-DD-slug.md as an Obsidian-compatible note with [[wikilinks]] to existing concepts. Triggers on - "פוסט לפייסבוק", "כתוב פוסט", "facebook post", "תסדר את הפוסט", "יש לי רעיון לפוסט", "post idea", "תפרסם", "redact a post".
---

# Facebook Post Skill

Aviz hands you a raw idea (a paragraph, a stream of thoughts, sometimes a single line). You return a clean, publish-ready Facebook post in Hebrew.

## Hard rules (do not break)

1. **Paragraph structure** — each paragraph is ONE thought. Separate paragraphs with a single blank line. No bullets, no numbered lists, no markdown headings inside the post body unless Aviz used them.
2. **Hebrew, RTL, conversational** — match Aviz's voice. Short, punchy, direct. He hates hype.
3. **Don't invent content** — restructure, tighten, reorder, fix grammar. Do NOT add new claims, examples, or stories he didn't mention.
4. **No emojis unless he used them.** No hashtags unless he asked. No "👇 read this thread" cliché.
5. **Strong opening line.** The first sentence is the Facebook preview. Make sure it stands alone and creates curiosity or states the punchline.
6. **Final body to clipboard, ALWAYS.** Use `pbcopy`. He should be able to paste straight into Facebook the moment you're done.
7. **Save the file every time.** No exceptions, even for "tiny" posts.

## Workflow

### Step 1 — Get the raw idea

Either Aviz pasted it, or ask once briefly: "מה הרעיון?" Then wait.

### Step 2 — Detect linkable concepts

Before writing, scan the input for concepts that already exist in this repo so you can wikilink them:

```bash
ls /Users/aviz/architect-workshops/content/*.md 2>/dev/null
ls /Users/aviz/architect-workshops/content/posts/ 2>/dev/null
ls /Users/aviz/architect-workshops/future-concepts/ 2>/dev/null
```

Recurring concepts that deserve `[[wikilinks]]` when mentioned:
- `[[Boss Mode]]` / `[[boss-mode]]`
- `[[Claude Code]]`
- `[[Spaceship Mode]]` / `[[חלל]]`
- `[[חצי-אוטומאט]]` / `[[Semi-Auto]]`
- `[[Exponential Efficiency]]` / `[[exponential-efficiency]]`
- `[[Skills]]`, `[[CLAUDE.md]]`
- Workshop names — link to `[[workshops/YYYY-MM-DD-topic]]` if directly referenced

If a concept isn't in the repo yet, **don't fabricate a link**. Either skip the brackets or note it at the end as "TODO: create concept page".

### Step 3 — Restructure

Break the idea into 3-7 paragraphs typically. Each paragraph:
- One thought / one beat
- 1-3 sentences max
- Separated from the next by ONE blank line (not two)

Common Aviz structure (use as guide, not rigid template):
1. Hook — the surprising/contrarian/personal opening
2. Context — what triggered this thought
3. The point — the actual insight
4. Example or evidence
5. Takeaway / question to the reader

### Step 4 — Pick a slug

`YYYY-MM-DD-short-english-slug.md` (use today's date — check via `date +%Y-%m-%d`).

Slug = 2-4 English words capturing the topic. Examples: `boss-mode-vs-executor`, `tom-pattern`, `repo-as-content-home`. Don't transliterate Hebrew.

### Step 5 — Save the file (Obsidian format)

Path: `/Users/aviz/architect-workshops/content/posts/YYYY-MM-DD-slug.md`

Template:

```markdown
---
date: YYYY-MM-DD
platform: facebook
status: draft
tags: [post, facebook]
---

# {{One-line title in Hebrew}}

> [!note] Raw idea
> {{The original input from Aviz, verbatim}}

## Post

{{The final post body — Hebrew, paragraphs separated by blank lines, with [[wikilinks]] where relevant}}

## Meta

- Published:
- URL:
- Reach / engagement:
```

The `## Post` section content is what gets copied to clipboard.

### Step 6 — Copy to clipboard

ALWAYS run this, with the **final post body only** (not the frontmatter, not the title, not the "Raw idea" block):

```bash
cat <<'EOF' | pbcopy
{{post body}}
EOF
```

Use a heredoc so quotes/dollar signs/backticks in the post don't get mangled.

### Step 7 — Confirm to Aviz

Show him:
1. The final post body (rendered cleanly in chat — preserve blank lines)
2. ✅ Saved to `content/posts/YYYY-MM-DD-slug.md`
3. ✅ Copied to clipboard

Keep the confirmation 2-3 lines max. Don't re-explain the post.

## Style notes (Aviz's voice)

- "Less hype, more practical" — no "🚀 game-changer 🚀"
- He often opens with a personal moment or a contrarian observation
- He uses concrete examples (Tom Hagiladi, specific workshops, real numbers)
- Punchlines land at the end, not the beginning, when it's a story
- For insight posts: punchline up front, then unpacking
- He's OK with asking the reader a question at the end — but only when it's genuinely open, not bait

## What NOT to do

- ❌ Add a "Generated with Claude" footer or any AI disclaimer
- ❌ Use "—" (em-dash) heavily, he uses regular hyphens
- ❌ Sprinkle emojis to "engage"
- ❌ Translate Hebrew to English or vice versa unless asked
- ❌ Pad short ideas into long posts. If he gave you 4 sentences, the post is probably 4 sentences.
- ❌ Add a CTA ("צרו קשר", "הצטרפו לסדנא") unless he asked or it's clearly the post's purpose

## Future siblings

This is the first content-creation skill. When more come (`linkedin-post`, `whatsapp-broadcast`, `lecture-script`, etc.), they should follow the same shape: restructure → detect concepts → save Obsidian-style → clipboard → confirm.
