---
name: social-publisher
description: "Publish content to multiple social media platforms (Facebook, Instagram, LinkedIn, WhatsApp). Use when user asks to 'publish', 'post', 'share on social media', 'distribute content', or wants to send marketing messages."
---

# Social Publisher

Publish content to multiple social media platforms from a single command.

## Workflow: Content Adaptation

When the user provides a message to publish, **ALWAYS**:

1. **Adapt the message for each platform** based on these rules:
2. **Present all versions** to the user for approval
3. **Ask which platforms** to publish to
4. **Publish** only after confirmation

### Platform Adaptation Rules

| Platform | Max Length | Tone | Format |
|----------|------------|------|--------|
| **Facebook** | 2000+ chars | Personal, storytelling | Full paragraphs, emojis OK |
| **LinkedIn** | 1300 chars | Professional, insights | Business value, no slang |
| **Twitter/X** | 280 chars | Punchy, hook | One key insight, hashtag optional |
| **Instagram** | 2200 chars | Casual, visual | Emojis, hashtags at end |
| **YouTube** | 5000 chars | Descriptive | Timestamps, links |

### Adaptation Examples

**Original message about AI agents:**

**Facebook:**
> אם העבודה שלכם קשורה למחשב - תעצרו.
> [Full story, personal experience, emotional]
> זה מבחן טורינג של הסוכנים. 🤖

**LinkedIn:**
> The "Agent Turing Test" - Can AI agents truly replace human workers?
> [Professional insight, business implications]
> After a week of intensive work with autonomous agents, I've seen tasks completed end-to-end without intervention.
> The productivity implications are significant.

**Twitter/X:**
> שבוע עם סוכני AI אוטונומיים.
> התפוקה? אולי פי 10.
> המפתח: משימות מקצה לקצה.
> זה מבחן טורינג החדש. 🤖

**Instagram:**
> 🤖 מבחן טורינג של הסוכנים
>
> לא "האם זה נשמע אנושי?"
> אלא "האם זה מועיל כמו עובד?"
>
> התשובה: כן. וזה קורה עכשיו.
>
> #AI #Automation #Productivity #AIAgents #ClaudeCode

## Supported Platforms

| Platform | API | Features |
|----------|-----|----------|
| **Facebook** | Ayrshare | Posts, images, links |
| **Instagram** | Ayrshare | Posts, images, reels |
| **LinkedIn** | Ayrshare | Posts, images, articles |
| **Twitter/X** | Ayrshare | Tweets, threads |
| **YouTube** | Ayrshare | Community posts |
| **WhatsApp** | Green API | Messages, images to groups |

## Setup

### 1. Install Dependencies

```bash
cd /Users/aviz/architect-workshops/.codex/skills/social-publisher/scripts
npm install
```

### 2. Configure APIs

Create `.env` file:

```env
# Ayrshare (for FB, IG, LinkedIn, Twitter, YouTube)
AYRSHARE_API_KEY=your_ayrshare_api_key

# Green API (for WhatsApp)
GREEN_API_INSTANCE_ID=your_instance_id
GREEN_API_TOKEN=your_api_token
```

## Usage

### Standard Flow (Recommended)

User provides a message, Claude:
1. Adapts for all platforms
2. Shows formatted versions
3. Asks which to publish
4. Publishes selected

Example:
```
User: תפרסם את זה: "הגעתי ל-10x productivity השבוע עם סוכני AI"

Claude: הנה הגרסאות לכל פלטפורמה:

📘 **Facebook:**
הגעתי ל-10x productivity השבוע עם סוכני AI...
[expanded version]

💼 **LinkedIn:**
This week I achieved 10x productivity using AI agents...
[professional version]

🐦 **Twitter/X:**
10x productivity עם סוכני AI.
לא הייפ. מציאות. 🚀

📸 **Instagram:**
🚀 10x productivity
[visual version with hashtags]

לאיזה פלטפורמות לשלוח?
```

### Direct Publish (Skip Adaptation)

```bash
npx ts-node publish.ts --facebook --message "Your message" --no-adapt
```

### Options

| Option | Description |
|--------|-------------|
| `--all` | Publish to all connected platforms |
| `--facebook` | Publish to Facebook |
| `--instagram` | Publish to Instagram (requires image) |
| `--linkedin` | Publish to LinkedIn |
| `--twitter` | Publish to Twitter/X |
| `--whatsapp` | Send to WhatsApp |
| `--message <text>` | Post/message text |
| `--image <path>` | Image file path |
| `--group <id>` | WhatsApp group ID |
| `--dry-run` | Preview without posting |

## Response Format

When presenting adapted content, use this format:

```
📱 **גרסאות מותאמות לפרסום:**

---

📘 **Facebook** (מוכן לשליחה)
[content]

---

💼 **LinkedIn** (מוכן לשליחה)
[content]

---

🐦 **Twitter/X** (280 תווים)
[content]

---

📸 **Instagram** (דורש תמונה)
[content]

---

**לאיזה פלטפורמות לשלוח?**
1. כולם
2. Facebook + LinkedIn
3. Twitter בלבד
4. אחר (ציין)
```

## Integration with Other Skills

- **marketing-copy**: Generate content, then adapt and publish
- **nano-banana-poster**: Generate poster, then publish with image
- **workshop-updates**: Mark "published" in pipeline
