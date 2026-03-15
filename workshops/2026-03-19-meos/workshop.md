# meOS - מערכת הפעלה אישית עם Claude Code

---

## Logistics

| Field | Value |
|-------|-------|
| **Title** | meOS - מערכת הפעלה אישית עם Claude Code |
| **Date** | 2026-03-19 |
| **Day** | Thursday (יום חמישי) |
| **Time** | 10:00 |
| **Duration** | 2 hours (10:00-12:00) |
| **Price** | ₪75 |
| **Platform** | Zoom |
| **Zoom Link** | [TBD] |

### WhatsApp Group

| Field | Value |
|-------|-------|
| **WhatsApp Group Link** | [TBD] |
| **Green API Group ID** | [TBD] |

---

## Overview

סדנת בוקר שמציגה תפיסה חדשה: Claude Code הוא לא רק כלי AI - הוא **מערכת הפעלה אישית**.

כמו שמערכת הפעלה מנהלת את המחשב שלך, Claude Code מנהל את החיים הדיגיטליים שלך - אם אתה בונה אותו נכון. ההבדל בין שימוש בסיסי לבין meOS הוא **עושר הקונטקסט**: ככל שהמערכת מכירה אותך יותר, היא אפקטיבית יותר בכל דבר.

**התזה המרכזית:** רוב האנשים משתמשים ב-Claude Code כמו מחשבון (שאלה → תשובה). meOS זו ההבנה שאתה בונה **סביבה שלמה** שמכירה אותך, את העסק שלך, את ההעדפות שלך - וכל אינטראקציה נהנית מכל ההקשר הזה.

---

## Target Audience

- כל מי שמשתמש ב-Claude Code ורוצה להפוך אותו למערכת אישית
- בעלי עסקים שרוצים להבין איך AI יכול לנהל תהליכים
- בוגרי סדנאות קודמות שרוצים לעלות רמה
- לא נדרש ידע טכני מתקדם

---

## Core Concept: meOS

### The Big Idea

**meOS = עץ של הקשרים מקושרים, לא רשימת פיצ'רים.**

כדי לבנות meOS צריך להצליח **לשרשר כמה שיותר הקשרים שונים** במערך שהסוכן ידע לנווט בתוכו. ככל שהעץ עשיר יותר ומחובר יותר, המערכת חזקה יותר.

### The Context Tree

```
CLAUDE.md (שורש העץ - מפת הניווט)
│
├── 📁 ידע בתיקיות (data/, knowledge/, references/)
│   └── CLAUDE.md מלמד את הסוכן מה יש כאן ואיפה
│
├── 🔧 סקילים מקומיים (של הפרויקט הזה)
│   └── הסוכן רואה אותם אוטומטית
│
└── 🔗 קריאות חוצות-פרויקטים (המודולריות)
    ├── סקיל פה → סקיל בפרויקט אחר
    ├── סקיל פה → סוכן של פרויקט אחר
    └── סוכן פה → סקיל של פרויקט אחר
```

### Key Principles

1. **CLAUDE.md = שורש העץ** - מלמד את הסוכן על מבנה הפרויקט, תת-תיקיות, ואיפה למצוא את הידע שהוא צריך
2. **סקילים = יכולות מודולריות** - הסוכן רואה את הסקילים של הפרויקט הנוכחי באופן טבעי
3. **מודולריות חוצת-פרויקטים** - לפעמים סקיל שייך רק לעבודה מסוימת, אז הוא חי בפרויקט אחר. אפשר לגשת אליו דרך:
   - סקיל מקומי שקורא לסקיל בפרויקט אחר
   - סוכן מקומי שקורא לסקיל בפרויקט אחר
   - סקיל מקומי שמפעיל סוכן של פרויקט אחר
4. **קונטקסט עשיר = אפקטיביות אקספוננציאלית** - אותה שאלה בדיוק, עם קונטקסט עני vs עשיר, מייצרת תוצאות שונות לחלוטין

### The OS Metaphor

| OS Component | Claude Code Equivalent |
|---|---|
| **Kernel** | ה-LLM עצמו |
| **System Settings** | CLAUDE.md |
| **File System** | מבנה תיקיות + Memory |
| **Applications** | Skills |
| **Drivers** | MCP Servers |
| **System Events** | Hooks |
| **IPC (Inter-Process Communication)** | קריאות חוצות-פרויקטים (skill→agent→skill) |
| **Boot Sequence** | טעינת קונטקסט בתחילת שיחה |

---

## Agenda

1. **מה זה meOS? (15 דק')**
   - למה "מערכת הפעלה" ולא "כלי AI"
   - הדמו: אותה שאלה, שתי סביבות - ההבדל שקונטקסט עושה
   - מ-מחשבון ל-מערכת הפעלה

2. **הרכיבים של meOS (30 דק')**
   - CLAUDE.md = System Settings - מי אתה, מה העסק, מה הכללים
   - Skills = Applications - כל סקיל הוא אפליקציה שרצה על המערכת
   - Memory = File System - מה המערכת זוכרת בין שיחות
   - MCP = Drivers - חיבור לגוגל, וואטסאפ, דפדפן, כל דבר
   - Hooks = System Events - אוטומציות שקורות מעצמן

3. **הדגמה חיה: בונים meOS מאפס (30 דק')**
   - לוקחים תיקיה ריקה
   - בונים CLAUDE.md עם זהות אישית/עסקית
   - מוסיפים סקיל ראשון
   - מחברים MCP ראשון
   - רואים את ההבדל בזמן אמת

4. **meOS בפעולה - סיפורים מהשטח (15 דק')**
   - דוגמאות אמיתיות מהמערכת של אביץ
   - איך 47 סקילים עובדים ביחד
   - מ-skill בודד ל-אקוסיסטם שלם

5. **איך מתחילים? (15 דק')**
   - הצעד הראשון: CLAUDE.md
   - הצעד השני: הסקיל הראשון שלך
   - הטעות הנפוצה: לנסות לבנות הכל ביום אחד (Tom Pattern)

6. **שאלות ותשובות (15 דק')**

---

## Pre-Workshop: Windows Installation Guide

**Video guide** for installing Claude Code on Windows - recorded before the workshop using a VPS with remote desktop.

- [ ] Purchase Windows VPS
- [ ] Record installation walkthrough
- [ ] Upload and share with participants

---

## Links

| Description | URL |
|-------------|-----|
| [Registration] | [TBD] |
| [Windows Installation Guide] | [TBD] |

---

## Assets

| File | Description |
|------|-------------|
| `presentation-plan.md` | Presentation blueprint (Hebrew, RTL) |
| `assets/poster.png` | Workshop promotional poster |
| `assets/slides.pdf` | Final presentation slides |
| `assets/windows-install-guide.mp4` | Windows installation video |

---

## Recommendations & Testimonials

> Add participant feedback after the workshop

---

## Pipeline

### POC (Proof of Concept)
- [ ] Idea defined
- [ ] Core demo prepared (same question, two environments)
- [ ] Live build demo scripted

**POC Notes:** [TBD]

### Pre-Workshop Content
- [ ] Windows VPS purchased
- [ ] Installation guide recorded
- [ ] Guide uploaded and linked

### Sneak Peeks
| # | Date | Platform | Link | Notes |
|---|------|----------|------|-------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

### Presentation
- [ ] Content outline reviewed
- [ ] Presentation plan created (`presentation-plan.md`)
- [ ] Slides created via NotebookLM Studio (manual step)

### Poster & Marketing
- [ ] Poster created
- [ ] Facebook groups
- [ ] WhatsApp broadcast
- [ ] WhatsApp groups

**Marketing Notes:** [TBD]

### Workshop Delivery
- [ ] Workshop delivered

**Attendance:**
| Metric | Count |
|--------|-------|
| WhatsApp Group Size | |
| First 15 min | |
| Peak | |
| Last 15 min | |

### Post-Workshop
- [ ] Transcript added
- [ ] Summary written
- [ ] Testimonials collected
- [ ] Follow-up sent

---

## Notes

- **Morning workshop** - different energy than evening sessions, more focused audience
- **meOS concept** is the evolution of Zero Friction philosophy ("not the tool, the environment")
- Include Tom Pattern warning in "how to start" section
- Prepare Windows installation video before the workshop as pre-work material
