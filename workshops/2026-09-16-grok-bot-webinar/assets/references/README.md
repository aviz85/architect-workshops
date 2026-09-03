# Grok Bot Visual References

Downloaded 2026-09-03 via curl (no browser automation) for the 2026-09-16 Grok Bot webinar poster/presentation.
Grok Bot is xAI's product launched 2026-08-11: always-on AI agent "teammates" that each get their own
cloud computer, sign into a user's real tools/apps, and finish multi-step work with minimal supervision.

## Files

| File | Dimensions | Source | Description |
|---|---|---|---|
| `01-hero-xai-announcement-og.png` | 1920x1080 | `https://x.ai/images/news/introducing-grok-bot-og-2.png` (og:image on `https://x.ai/news/introducing-grok-bot`) | Official xAI hero/OG image: blue gradient background with the white Grok Bot mascot mark + "Grok Bot" wordmark. Best hero/title-slide asset. |
| `02-grok-bot-logo-mark.svg` | vector | `https://asvg.app/assets/svg/grok-bot/grok-bot-logomark-mono.svg` | Clean standalone vector Grok Bot mascot logomark (circular "bot head" with two eye cutouts via SVG mask), `fill="currentColor"`, color set to dark gray inline so it renders correctly on any background. Matches the mark shown in the official hero image. |
| `02b-grok-bot-logo-mark-512.png` | 512x512 | Rendered locally from `02-grok-bot-logo-mark.svg` via macOS `qlmanage` | Raster (transparent PNG) version of the same logomark, for tools that can't place an SVG directly. |
| `03-app-ui-mobile-chat-list.jpg` | 640x360 | `https://ealqqtdyihheyzgbzihq.supabase.co/.../grok-bot-xai-ai-agents-explained-grok-bot-mobile-app.jpg` (via ayautomate.com blog post) | iPhone screenshot of the Grok Bot mobile app: a Messages-style inbox listing multiple named bots ("New Bot", "Bruno The Browser", "Lincoln", "Robby The Research", "Atlas", "Ezra The Email", "Sam the scripter", "Grok", "Harry"). Frame includes a small presenter face-cam PiP in the corner (video-still, not clean marketing art). |
| `04-desktop-create-first-bot.jpg` | 1600x1234 | `https://flaviocopes.com/images/grok-bot/create-first-bot.jpg` (deep-dive blog post) | Clean macOS desktop app screenshot: "Create your first Bot" onboarding screen — bot color picker, avatar-shape picker (several bot mascot variants), name field, and starter suggestions ("Night Shift", "Inbox Triage"). Good for showing bot personalization / the mascot family. |
| `05-desktop-bot-team-chat-sales-outbound.jpg` | 1480x1600 | `https://flaviocopes.com/images/grok-bot/product-page.jpg` (screenshot of `x.ai/bot`, which blocks curl directly via Cloudflare) | Full x.ai/bot landing page: "Meet Grok Bot" hero copy/CTA buttons at top, plus below it a real product screenshot of a "Sales Outbound" bot-team group chat coordinating Salesforce/Hex/LinkedIn/Sequencer steps with multiple bots (Chief, Account Manager, Talent Scout, etc.) listed in the sidebar. Best single asset for "bot team" / multi-agent coordination visual. |
| `06-desktop-daily-routine-builder.jpg` | 1600x1363 | `https://flaviocopes.com/images/grok-bot/daily-routine.jpg` | Desktop app screenshot showing a "Blog Pulse" bot chat on the left/middle and the "Routine" side panel on the right (Active toggle, Name, Instruction text, "When to run: Every day at 10:01 AM", Run history). Good for showing the scheduled/automated task ("routines") feature. |
| `07-desktop-plugins-marketplace.jpg` | 1600x1234 | `https://flaviocopes.com/images/grok-bot/plugins.jpg` | Desktop app "Plugins" modal/marketplace: category tabs (Agent Orchestration, Canvas, MCP, Sales, Scheduling, etc.) and featured integrations (Gmail, Google Calendar, Google Drive, Granola) with Add buttons. Good for showing tool/integration breadth. |
| `08-workflow-linkedin-oauth-connecting.jpg` | 640x360 | ayautomate.com blog (`grok-bot-xai-ai-agents-explained-grok-bot-linkedin-handoff.jpg`) | Dark-mode desktop window mid-OAuth: "Sign in to LinkedIn, then hand it back" / "Connecting..." — shows the bot handing control back to the human for login. Lower information density (mostly blank), kept because it documents the human-handoff workflow specifically. |
| `09-workflow-teach-a-task-browser.jpg` | 640x360 | ayautomate.com blog (`grok-bot-xai-ai-agents-explained-grok-bot-teach-a-task.jpg`) | Screenshot captioned "New Bot is watching and learning" — an embedded Chrome browser window (Google.com) that the bot is observing to learn a task ("teach a task" feature). |
| `10-workflow-report-artifact-blog-pulse.jpg` | 1600x1363 | `https://flaviocopes.com/images/grok-bot/blog-pulse-morning-report.jpg` | Desktop chat thread showing a bot's written status report (a multi-paragraph findings summary) plus an attached generated Markdown file artifact (`2026-08-22.md`, 4.6 KB) and a follow-up message — shows the bot producing a saved document as output. |
| `11-oauth-signin-account-picker.jpg` | 1600x937 | `https://flaviocopes.com/images/grok-bot/account-authorization.jpg` | Browser OAuth screen: "Sign in to Grok Bot" with the black Grok Bot mascot icon, account picker (name + email), Cancel/Sign in buttons. Clean shot of the logo mark in real UI context plus the auth flow. |

## Notes / what was skipped

- The main announcement page `https://x.ai/news/introducing-grok-bot` is a heavily client-side-rendered
  Next.js page — curl only exposed the `og:image` (file 01), an inline SVG logo mark (superseded by the
  cleaner version in file 02), and one hero `.mp4` URL (`media.x.ai/.../260810_2245_bw_dr_cursor_bot_edit_v8...mp4`)
  that returned an HTML challenge page instead of video data when fetched with curl — could not be downloaded.
- The dedicated product page `https://x.ai/bot` returned a Cloudflare "Attention Required" challenge page to
  curl and could not be fetched directly; file `05` is a third-party screenshot of that same page instead.
- `https://docs.x.ai/grok-bot/*` (official docs) are also fully client-rendered — no static screenshots
  were reachable via curl, only auto-generated text-only OG cards.
- Skipped as not Grok-Bot-specific: a generic AI/server-room stock photo used as `unite.ai`'s article
  header (no Grok Bot branding or UI), and a mem0.ai blog title card (mem0-branded, no Grok Bot UI).
- Skipped: a first extracted inline `<svg class="grok-bot-mark">` from the x.ai page — it relied on
  external CSS for eye-cutout coloring that curl couldn't retrieve, so as a standalone file it rendered
  as a solid blob with no eyes. Replaced with the self-contained masked version (file `02`).
- All images above 400px width and 20KB except `08` (11.8KB) and `09` (21KB, borderline) — both are
  640x360 legitimate screenshots (not icons/tracking pixels), kept because they're the only assets found
  documenting the OAuth-handoff and "teach a task" browser-watching workflows specifically.
