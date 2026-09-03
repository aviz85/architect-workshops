# Grok Bot — Research Brief for "גרוק בוט — סוכן מהעתיד"

Compiled 2026-09-03 by a background research agent (web search + fetch). Shared by both sessions (16.9 and 23.9).

Legend: **[xAI]** = official xAI/Cursor docs or announcements · **[user]** = user/reviewer reports · **[inference]** = agent's read.

## Pillar 1 — Usage limits and metering ("איך לא לגמור את כל הטוקנים בשעתיים")

- **[xAI] Metering is tokens, not bots/hours.** Every eligible plan gets a *weekly* Grok Bot allowance (resets Monday), separate from Grok chat and Cursor usage; past the allowance, work continues on **on-demand usage "billed from model and token cost"**, and there is **"no Grok Bot-specific spend cap yet."** No fee per Bot, per cloud-computer hour, per connector, or per routine. https://docs.x.ai/grok-bot/faq · https://www.eesel.ai/blog/grok-bot-pricing · https://www.aipricing.guru/news/xai-grok-bot-launch-pricing-impact-august-2026/
- **[xAI] Allowance size is unpublished** for every tier — the sub is "an access floor," not a budget. https://www.aibuilderclub.com/blog/grok-bot-pricing
- **[xAI] Plans (timeline):** Aug 11 launch = SuperGrok Heavy ($300), Cursor Ultra ($200), Cursor Teams Premium ($120/seat). Aug 21 = added SuperGrok Plus ($100), Cursor Pro+ ($60), all Teams seats, plus a one-time 7-day free trial credit (drawn by "agent steps and tokens"). Aug 26 = added base SuperGrok ($30) and Cursor Pro ($20); weekly limits were reset. SuperGrok Lite/Team/Enterprise excluded; Enterprise "rolling out." If you hold both Cursor and SuperGrok, the Bot uses whichever has more usage. https://cellcog.ai/blog/grok-bot-cursor-pro/ · https://www.aibuilderclub.com/blog/grok-bot-pricing · https://docs.x.ai/grok-bot/faq
- **[xAI] Concurrency:** Bots reason/use connectors/files in parallel, but **"one Bot can run one computer-use task on its screen at a time,"** and all Bots on an account share one cloud computer. No published cap on number of Bots. https://docs.x.ai/grok-bot/faq
- **[user] Burn reports:** a 6-agent business used "42% of my weekly allowance on day one" (Aug 14); ~100 basic completions + a 10-min script = 5% of weekly (Aug 22); a Heavy subscriber lost ~half the week on one workload; one reverse-engineered a Heavy weekly pool at ~16.4M tokens; another: "roughly 40 percent of a weekly quota gone in about ten minutes." Early-access user: "I've used less tokens in the last 5 years… than I have this month." https://cellcog.ai/blog/grok-bot-problems/ · https://www.eesel.ai/blog/grok-bot-pricing
- **[user] Counter-report:** a Cursor Ultra reviewer said after a full first day "my weekly usage hadn't increased significantly" — burn depends heavily on pattern (routines/browsing vs. short tasks). https://note.com/masa_wunder/n/na9744c486976?hl=en
- **[user] Why it burns:** each Bot is "one unbounded thread" — no fresh-session, no manual compaction, no visible context meter (staff-confirmed Aug 20); simple work routed through a heavyweight model tier. xAI reportedly acknowledged the burn and said efficiency work is in progress. https://cellcog.ai/blog/grok-bot-problems/ · https://www.aibuilderclub.com/blog/grok-bot-guide
- **[inference]** No "bot hours" concept — cost = (runs × context length × model tier). Every routine wake-up costs tokens even when nothing changed.

## Pillar 2 — Efficiency tricks ("טריקים שהופכים אותו ליעיל במיוחד")

- **[user – xAI engineer Lauren Tan] Routine frequency is tip #1:** a 15-min routine runs ~96×/day; hourly or a few times a day is usually enough. Long chats make routines expensive — give recurring jobs to a *fresh* Bot, keep chatting with your chief-of-staff. https://x.com/poteto/status/2091368467060662497
- **[user – Morgan Linton, runs 12 Bots]** Don't let a Bot "use a site like a human" when a connector exists; if you're telling a Bot something for the second time, make it a skill. https://x.com/morganlinton/status/2094413837290369028
- **[user] Event triggers over polling** (Slack/GitHub event → work only when something changed); "every run consumes usage, even when the Bot wakes up and finds nothing." Scope routines to business hours. https://flaviocopes.com/grok-bot/ · https://www.aibuilderclub.com/blog/grok-bot-guide
- **[xAI/Composio] Writing the brief:** Name + single Job + short Description, e.g. "Research AI agent products using public sources. Keep direct source links for every important claim. Separate verified facts from assumptions." First task should state result, allowed sources, limits, output format, review timing. https://composio.dev/content/guide-to-frok-bot
- **[user] "Every description ends with a fence":** spend-and-send actions (publish, purchase, delete, sign) require approval; reversible actions run free. Official mechanism: narrow **Require Approval** rules (Settings → General → Auto-review). https://www.aibuilderclub.com/blog/grok-bot-guide · https://docs.x.ai/grok-bot/faq
- **[user] Role vs. task:** Role = persistent persona (chief-of-staff + one specialist per lane); Task = the assignment. Separate "permanent rules, recurring job, current assignment" in instructions. Sequence: **task → skill → routine, with a test run between each** ("a routine inherits every unstated assumption in the task it was built from"). https://flaviocopes.com/grok-bot/ · https://www.aibuilderclub.com/blog/grok-bot-guide
- **[xAI] Teach a task:** record one browser workflow from the computer view (max **10 minutes**) → Bot drafts a skill you review/test. **[user]** Keep recordings narrow (one operation); do a second run where you *reject* a candidate midway and say which check failed. Recordings break when site layouts change. https://docs.x.ai/grok-bot/faq · https://note.com/masa_wunder/n/na9744c486976?hl=en · https://www.layer3labs.io/guides/grok-bot-review
- **[user] Memory:** "Chat is history. That file is memory." Keep durable state in `/workspace` (survives computer updates); let only one Bot write shared files; decide explicitly what's shared knowledge vs. per-Bot memory. **[xAI]** "For important or changing facts, check the current source rather than relying only on Bot memory." https://www.aibuilderclub.com/blog/grok-bot-guide · https://www.mindstudio.ai/blog/grok-bot-tips-and-hacks · https://composio.dev/content/guide-to-frok-bot
- **[xAI] Stopping loops:** send a short redirect or "Stop now"; check whether an approval rule is causing repeated retries; "Reset Agent Computer" is last resort (restores last snapshot, may lose work). https://docs.x.ai/grok-bot/troubleshooting
- **[user] Anti-over-browsing:** state-file pattern "if nothing, send nothing" — otherwise "a bot will invent relevance to justify running"; don't point triage at years of backlog on day one; route scraping through research connectors. https://www.aibuilderclub.com/blog/grok-bot-guide
- **[xAI] Login handoff ("computer takeover"):** passwords, 2FA, CAPTCHAs are human-only; you take control, sign in, confirm the page loaded, hand back. Sessions persist. Ask the Bot for a **secrets input** field instead of pasting keys in chat (masked, hidden from model). https://docs.x.ai/grok-bot/faq · https://docs.x.ai/grok-bot/troubleshooting · https://x.com/tetsuoai/status/2092717918362701880
- **[xAI] Group chats:** 2–6 Bots; they message each other, pass ownership, @-mention. **Chief-of-staff pattern:** "coordinate the work, not do it." Onboarding prompt: "Review my connections, build a profile of my workstreams… suggest the three most useful agents, automations, and plugins." Lauren Tan runs 1 chief of staff + 3 managers + 16 workers, claims ~90% of routine automated; "only 1% of users use it correctly." https://composio.dev/content/guide-to-frok-bot · https://app.therundown.ai/guides/hand-off-real-work-across-your-apps-with-grok-bot · https://x.com/0xMovez/status/2094477810177806468
- **[user] "Grill-me" skill:** a reusable skill that interviews you relentlessly before planning, instead of assuming. https://www.mindstudio.ai/blog/grok-bot-tips-and-hacks

## Pillar 3 — Highest-value work use cases ("איפה התועלת האיכותית ביותר")

- **[xAI] Official catalog:** Inbox Manager, CRM Operations Manager, Deal Desk Coordinator, Account Research, Talent Scout (screen-to-offer with ATS dedupe), Hiring Screener, Expense Manager, Invoice Coordinator, Pipeline Analyst, Daily Briefing Writer, Personal Site Builder. Pitch: computer use covers "80% of the internet without an API." https://x.ai/bot/use-cases · https://www.ayautomate.com/blog/grok-bot-xai-ai-agents-explained
- **[user] Inbox:** Mike P processed ~90,000 emails across two Gmail accounts; Darian Shirazi's Bot found five merchants with unreturned refunds, recovering more than the monthly cost. https://stealwhatworks.com/blogs/news/grok-bot-best-use-cases
- **[user] No-API back office:** roofing contractor Price Foulger — in two days the Bot filed online permits, booked inspections, prepared insurance notices, created subcontracts, built proposals, flagged certificate discrepancies. (same source)
- **[user] CRM from history:** Gaurav Munjal converted 10 years of calendar meetings into a Notion DB (~1,000 contacts, first 3 years in 2.5 hrs). Tejas Rane filled a prospect DB with LinkedIn profiles + verified emails. Liam Fallen re-contacted 6 months of churned customers, reportedly paying for the Bot. (same source)
- **[user] Support/refunds:** Gergely Orosz wired a Bot to a customer inbox + Stripe for routine refunds under strict constraints. (same source)
- **[user] Monitoring/reporting:** Flavio Copes runs "Blog Pulse" (Plausible + GitHub deploys + RSS daily), changelog updates, course-cohort checks — insists on a Markdown report with source links as the deliverable. https://flaviocopes.com/grok-bot/
- **[user] Social/Slack routines:** 30-minute social monitoring; Slack-triggered auto-replies tested working. https://www.ayautomate.com/blog/grok-bot-xai-ai-agents-explained · https://note.com/masa_wunder/n/na9744c486976?hl=en
- **[inference]** The sweet spot is click-heavy, multi-app, login-gated chores with reversible outcomes; reviewers say worth it "only if you already pay for a plan that includes it." https://www.layer3labs.io/guides/grok-bot-review

## Pillar 4 — What is genuinely futuristic, and the honest limits ("מה כל כך עתידני בו")

- **[xAI] Own cloud computer, always on:** persistent VM with browser, filesystem, terminal; work continues after you close the laptop; start at night, find it done by morning. Mobile has live-session takeover. https://x.ai/news/introducing-grok-bot · https://docs.x.ai/grok-bot/overview
- **[xAI] Persistent identity + memory:** named Bots keep memory, files, browser sessions, preferences across turns; corrections stick. https://docs.x.ai/grok-bot/overview
- **[xAI] Learning by demonstration + routines + multi-Bot teams** with inter-Bot messaging — vs. Claude Code's task-scoped sessions that "reset around each task." https://www.mindstudio.ai/blog/grok-bot-vs-claude-code
- **[user] Positioning vs. others:** Claude Cowork = local desktop + explicit permission model; Manus = separate persistent server/cloud browser/sandboxes with run logs; Claude Code wins for repo work — use them sequentially ("operations Bot finds the problem, coding agent changes the code"). https://www.eesel.ai/blog/grok-bot-alternatives · https://flaviocopes.com/grok-bot/
- **[user] Context engineering under the hood:** leaked prompt shows a frozen system-prompt/"compactionEpoch" design to preserve KV cache (agent runs ~100:1 input:output). https://yage.ai/share/grok-bot-context-engineering-en-20260827.html
- **[xAI] Limitation — one computer per account, not per Bot:** "Do not use separate Bots as a security boundary." Marketing says "own cloud computer," docs say all Bots share it. **[user]** per-Bot Chrome profiles reset daily; a stuck computer paralyzes the whole roster. https://docs.x.ai/grok-bot/faq · https://cellcog.ai/blog/grok-bot-problems/
- **[xAI] No model picker** ("we do not plan to allow admin or user choice"); **[user]** yet a hidden "Elon-Only Settings" picker lists 33 models incl. Claude Opus 5 / GPT-5.6; model routing unconfirmed. https://runtimewire.com/article/grok-bot-s-hidden-elon-only-settings-picker-lists-33-models
- **[user] Security:** "lethal trifecta" (private data + untrusted content + external comms); Bots sign into SaaS with human credentials; no memory inspection/export; thin audit logs. https://kenhuangus.substack.com/p/grok-bot-against-every-managed-agent · https://www.vellum.ai/blog/official-grok-bot-breakdown
- **[user] Reliability:** Aug 20–21 widespread "Bot failed to respond"/stuck-computer incident (Cursor staff confirmed); a layout change can leave the Bot "clicking the old spot without flagging it." https://cellcog.ai/blog/grok-bot-problems/ · https://www.layer3labs.io/guides/grok-bot-review
- **[xAI] Beta, no voice mode, no free tier** (trial only). https://www.ayautomate.com/blog/grok-bot-xai-ai-agents-explained

## Changes since launch (Aug 11 → Sep 3)

- Aug 12: Grok 4.6 (500K ctx) shipped, listed as available in Grok Bot. https://forum.cursor.com/t/grok-bot-is-now-live-on-android/170384
- Aug 20–21: stuck-computer outage. Aug 21 & 26: plan expansions to $20 floor; weekly limits reset. https://cellcog.ai/blog/grok-bot-cursor-pro/
- Aug 27: system-prompt leak analysis.
- **Sep 2: Android app live** (Android 9+; Google Play `ai.x.grok.bot`) — the "no Android" talking point is now outdated. https://forum.cursor.com/t/grok-bot-is-now-live-on-android/170384 · https://docs.x.ai/grok-bot/faq
- Still missing: Linux desktop, iPad, model choice, published allowance sizes, spend cap. Grok 4.7 expected mid-September (unconfirmed).

Not retrieved: full text of Morgan Linton's 12-Bot thread and Lauren Tan's 1-hour talk (X paywalled) — only what search snippets exposed.

## What this changes for the webinar (Aviz's take, to confirm)

- **Block 4 (tokens)** has real teeth: weekly allowance that resets Monday, unpublished size, on-demand overage with no spend cap, and one unbounded thread per bot. The three biggest burners are routine frequency, long-lived chats, and browsing where a connector exists.
- **Block 2 (futuristic)** needs the honest footnote: marketing says "own cloud computer per bot", docs say one computer per *account*, shared by all bots.
- **Block 6 (limits)**: drop "no Android" — it shipped 2.9. Entry price is now $20 (Cursor Pro) or $30 (SuperGrok), not $200+.
- **Demo access**: the 7-day trial credit (added Aug 21) may be enough for a rehearsed demo without a paid plan. Confirm it is still offered.
