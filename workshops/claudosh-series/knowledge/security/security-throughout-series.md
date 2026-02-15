# Security & Control - Woven Throughout the Series

> Source: Deep Interview, 2026-02-15

## Philosophy: Security Follows the Leash

Security isn't a one-time topic. It grows WITH the autonomy:

```
More autonomy → More control needed → More security understanding
```

Each session introduces security concepts matched to that session's autonomy level.

---

## Session 1: Basic Safety (5-10 min woven in)

**When:** During "Folder = Workspace" and "Short Leash" blocks

### Topics
- **Permission prompts:** Claude asks before doing anything risky. READ the prompts.
- **Don't enter unknown folders:** Agent reads files and can act on malicious instructions
- **The permission dialog:** What "Allow", "Deny", "Allow for session" mean
- **Why short leash:** You need to understand what the agent does before trusting it

### Key Message
> "הסוכן שואל רשות לפני כל פעולה מסוכנת. קראו את מה שהוא שואל. זו ההגנה הראשונה שלכם."

### Demo
- Show a permission prompt, explain each part
- Show what happens when you deny

---

## Session 2: Permissions Deep Dive (10-15 min)

**When:** During "Release the Leash" block (expand this block)

### Topics
- **--dangerously-skip-permissions:** What it actually does, why the scary name
- **The trade-off:** Speed vs safety. When to use, when NOT to use
- **Permission modes:** Default, acceptEdits, plan mode
- **What Claude CAN'T do** even with skip-permissions: still won't delete system files, still has safety rails

### Key Message
> "שחרור הרצועה לא אומר שאין גדר. יש עדיין גבולות שהסוכן לא יעבור."

### Demo
- Run with default permissions → see all the prompts
- Run with --dangerously-skip-permissions → see the speed difference
- Show plan mode as read-only safety net

---

## Session 3: Hooks & Tool Control (20-25 min dedicated block)

**When:** Expanded block before/after the agentic app build

### Topics

#### Hooks - Your Guard System
- **What are hooks?** Scripts that run before/after every agent action
- **PreToolUse:** Intercept and block dangerous commands before execution
- **PostToolUse:** Audit and log what the agent did
- **Real example:** Hook that blocks `rm -rf` commands

#### Permission Rules - Allow/Ask/Deny
- **Deny list:** Things the agent can NEVER do
- **Ask list:** Things that always need your approval
- **Allow list:** Things you trust (auto-approved)
- **Order of evaluation:** deny beats ask beats allow

#### Tool Restrictions
- Block entire tool categories (no Bash, no web fetch)
- Whitelist specific commands (only `npm run build`, only `git commit`)
- MCP server restrictions

#### Practical Exercise
- Participants write a simple hook that logs all Bash commands
- Participants configure allow/deny rules for their agentic app
- Test: verify the hook actually blocks a dangerous command

### Key Message
> "הוקים זה כמו מצלמות אבטחה ושומרים. הסוכן יכול לפעול בחופשיות, אבל יש מי שבודק כל פעולה."

### Demo
- Show a PreToolUse hook blocking `rm -rf`
- Show audit logging hook
- Show allow/deny configuration in settings.json

---

## Session 4: Prompt Injection & Production Safety (20-25 min dedicated block)

**When:** Dedicated block + woven into swarm/ecosystem discussion

### Topics

#### What is Prompt Injection?
- **The attack:** Malicious text in files/web pages that tries to hijack the agent
- **Why it matters:** As you give agents more autonomy, this risk grows
- **Real-world examples** (safe to show):
  1. Malicious CLAUDE.md in a cloned GitHub repo
  2. Instructions hidden in a file the agent reads
  3. Web content trying to override agent instructions
  4. MCP server returning manipulative output

#### How Claude Code Defends
1. **Permission system** - agent asks before dangerous actions
2. **Fail-closed** - unknown commands need approval by default
3. **Command blocklist** - curl/wget blocked by default
4. **Context isolation** - web fetches in separate context
5. **Trust verification** - new repos prompt for trust

#### How YOU Defend (Practical)
1. **Review permission prompts** - don't auto-approve blindly
2. **Use hooks** - validate actions before execution
3. **Don't enter untrusted repos** - that CLAUDE.md might be malicious
4. **Restrict tools** - allow only what's needed
5. **Sandbox mode** - OS-level isolation for sensitive work
6. **Defense in depth** - multiple layers, not just one

#### The Security Pyramid
```
Layer 6: DevContainers (complete isolation)
Layer 5: Sandboxing (OS-level filesystem/network)
Layer 4: Managed Settings (org-wide policies)
Layer 3: Hooks (intercept and validate)
Layer 2: Permissions (allow/ask/deny)
Layer 1: Core protections (blocklist, fail-closed)
```

### Key Message
> "ככל שהסוכן חזק יותר, האבטחה חשובה יותר. זה לא מפחיד - זה אחריות. אתם מנהלים, לא מפחדים."

### Demo
- Show a file with hidden "prompt injection" instructions
- Show how Claude handles it (detects, asks permission)
- Show how hooks add extra protection
- Show sandbox mode

---

## Teaching Approach: Not Scary, Empowering

### DO
- Frame security as "being a responsible manager"
- Use the leash metaphor: "you choose how much freedom to give"
- Show practical examples they can implement immediately
- Emphasize: Claude Code already has good defaults

### DON'T
- Make it sound terrifying
- Overwhelm with technical details
- Make them feel like agents are dangerous
- Skip it because "it's boring"

### The Frame
> "אתם לא צריכים לפחד מהסוכן. אתם צריכים להבין אותו. כמו כל כלי חזק - הוא דורש אחריות. וזה בדיוק מה שמפריד בין חובבנים למקצוענים."
