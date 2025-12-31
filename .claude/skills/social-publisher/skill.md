---
name: social-publisher
description: "Publish content to multiple social media platforms (Facebook, Instagram, LinkedIn, WhatsApp). Use when user asks to 'publish', 'post', 'share on social media', 'distribute content', or wants to send marketing messages."
---

# Social Publisher

Publish content to multiple social media platforms from a single command.

## Supported Platforms

| Platform | API | Features |
|----------|-----|----------|
| **Facebook** | Ayrshare | Posts, images, links |
| **Instagram** | Ayrshare | Posts, images, reels |
| **LinkedIn** | Ayrshare | Posts, images, articles |
| **WhatsApp** | Green API | Messages, images to groups |

## Setup

### 1. Install Dependencies

```bash
cd /Users/aviz/architect-workshops/.claude/skills/social-publisher/scripts
npm install
```

### 2. Configure APIs

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in credentials:

```env
# Ayrshare (for FB, IG, LinkedIn)
AYRSHARE_API_KEY=your_ayrshare_api_key

# Green API (for WhatsApp)
GREEN_API_INSTANCE_ID=your_instance_id
GREEN_API_TOKEN=your_api_token
```

### Getting Credentials

**Ayrshare:**
1. Sign up at [ayrshare.com](https://www.ayrshare.com/)
2. Connect your social accounts (FB, IG, LinkedIn)
3. Copy API key from dashboard

**Green API:**
1. Sign up at [green-api.com](https://green-api.com/)
2. Create instance and scan QR code
3. Copy Instance ID and API Token

## Usage

### Publish to All Platforms

```bash
npx ts-node publish.ts --all --message "Your message" --image "/path/to/image.jpg"
```

### Publish to Specific Platforms

```bash
# Facebook only
npx ts-node publish.ts --facebook --message "Post text"

# Instagram only (requires image)
npx ts-node publish.ts --instagram --message "Caption" --image "/path/to/image.jpg"

# LinkedIn only
npx ts-node publish.ts --linkedin --message "Professional update"

# WhatsApp group
npx ts-node publish.ts --whatsapp --group "GROUP_ID" --message "Message text"

# Multiple platforms
npx ts-node publish.ts --facebook --linkedin --message "Cross-post"
```

### Options

| Option | Description |
|--------|-------------|
| `--all` | Publish to all connected platforms |
| `--facebook` | Publish to Facebook |
| `--instagram` | Publish to Instagram (requires image) |
| `--linkedin` | Publish to LinkedIn |
| `--whatsapp` | Send to WhatsApp |
| `--message <text>` | Post/message text |
| `--image <path>` | Image file path |
| `--group <id>` | WhatsApp group ID |
| `--link <url>` | Link to include |
| `--dry-run` | Preview without posting |
| `--schedule <time>` | Schedule for later (ISO format) |

## Workshop Marketing Workflow

### 1. Prepare Content

Read marketing copy from workshop:
```bash
cat /path/to/workshops/YYYY-MM-DD/marketing.md
```

### 2. Publish Facebook Post

```bash
npx ts-node publish.ts \
  --facebook \
  --message "הפוסט שלך כאן..." \
  --image "/path/to/poster.jpg"
```

### 3. Publish to LinkedIn

```bash
npx ts-node publish.ts \
  --linkedin \
  --message "הפוסט המקצועי..."
```

### 4. Send to WhatsApp Group

```bash
npx ts-node publish.ts \
  --whatsapp \
  --group "120363xxx@g.us" \
  --message "ההודעה לקבוצה..." \
  --image "/path/to/poster.jpg"
```

### 5. Batch Publish (All at Once)

```bash
npx ts-node publish.ts \
  --facebook \
  --linkedin \
  --message "Your message" \
  --image "/path/to/poster.jpg"
```

## Platform-Specific Notes

### Facebook
- Images are optional
- Links auto-generate previews
- Best times: 9am, 1pm, 3pm

### Instagram
- **Image is required**
- Square (1:1) or portrait (4:5) recommended
- Hashtags can be included in message

### LinkedIn
- Professional tone recommended
- Images increase engagement 2x
- Best for B2B content

### WhatsApp
- Group ID format: `XXXXXXXXXX@g.us`
- Images sent separately from text
- Rate limits apply for bulk

## Error Handling

The script will:
1. Validate credentials before posting
2. Check image exists if specified
3. Report success/failure per platform
4. Continue to next platform on failure

## Examples

### Workshop Announcement (All Platforms)

```bash
npx ts-node publish.ts \
  --facebook \
  --linkedin \
  --message "🚀 סדנה חדשה: קלוד קוד אמאל׳ה

ה-\$100 הכי מנוצלים אי פעם.

יום חמישי 1.1.26 | 21:00 | Zoom | 50 ש״ח

קישור בתגובה הראשונה 👇" \
  --image "/path/to/poster.jpg"
```

### WhatsApp Reminder

```bash
npx ts-node publish.ts \
  --whatsapp \
  --group "120363xxx@g.us" \
  --message "🔔 תזכורת! הסדנה היום ב-21:00

נתראה שם! 🚀"
```

## Integration with Other Skills

This skill works well with:
- **marketing-copy**: Generate content, then publish
- **nano-banana-poster**: Generate poster, then publish with image
- **workshop-updates**: Mark "published" in pipeline

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Check .env file, regenerate key |
| "Image not found" | Use absolute path |
| "Rate limited" | Wait and retry, or schedule |
| "Account not connected" | Re-authorize in Ayrshare dashboard |
| "WhatsApp not authorized" | Rescan QR code in Green API |
