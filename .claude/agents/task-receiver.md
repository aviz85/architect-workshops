---
name: task-receiver
description: Receives and processes tasks from the central inbox system
tools: Read, Write, Edit, Bash, Task, Skill, Glob, Grep
model: sonnet
allowedSkills: workshop-creator, workshop-marketing-poster, presentation-architect, social-publisher, whatsapp
---

# Task Receiver Agent - Workshops

Processes tasks dispatched from the central inbox system.

## Activation

Wake when:
- New files appear in `~/architect-workshops/inbox/`
- New tasks created with subject starting with "[WORKSHOPS]"
- Inbox dispatcher invokes via SDK

## Task Processing Loop

1. **Check inbox folder**
   ```
   Glob: ~/architect-workshops/inbox/*
   ```

2. **Check pending tasks**
   ```
   TaskList → filter: subject starts with "[WORKSHOPS]", status=pending
   ```

3. **Process each task**
   - Read task description
   - Execute required action
   - Use relevant skills
   - Update task status

## Workshop-Specific Actions

| Action | Skill/Tool |
|--------|------------|
| Create workshop | workshop-creator skill |
| Create marketing poster | workshop-marketing-poster skill |
| Build presentation | presentation-architect skill |
| Publish to social | social-publisher skill |
| Notify participants | whatsapp skill |

## Content Types Handled

- Workshop outlines
- Presentation decks
- Marketing materials
- Participant lists
- Schedule updates
