# Tutorial Prompts & References

All prompts used in the workshop tutorial, ready for copy-paste.

---

## 1. Windows Shortcut Setup for Claude Code

**Shortcut Target:**
```
powershell.exe -NoExit -Command "cd '$env:USERPROFILE\Desktop\my-crm'; claude --dangerously-skip-permissions"
```

The `$env:USERPROFILE` variable automatically points to the user's folder (e.g., `C:\Users\John`).

---

## 2. Learning Claude Code Primitives

```
אני רוצה לבנות "Agentic App" - אפליקציה שמופעלת על ידי Claude Code.

לפני שנתחיל, אני צריך שתלמד על הפרימיטיבים של Claude Code:
1. Skills - מה זה ואיך יוצרים
2. Commands - פקודות מותאמות אישית
3. Agents - סוכנים שרצים ברקע
4. CLAUDE.md - קובץ הכללים

השתמש ב-claude-code-guide agent כדי ללמוד על כל אחד מהם ותן לי סיכום קצר.
```

---

## 3. Creating CLAUDE.md with Learning Rule

```
צור קובץ CLAUDE.md לפרויקט שלנו עם הכללים הבאים:

# My CRM - Business Management System

## Project Overview
מערכת ניהול לקוחות לעסק שמוכר קורסים וסדנאות בתחום ה-AI.

## Data Files
- `mock_crm_data.xlsx` - נתוני לקוחות ורכישות

## Rules
1. כל המסמכים יהיו בעברית
2. עיצוב מקצועי ונקי
3. שמירת קבצים בתיקיית `documents/`

## Claude Code Learning Rule
**חשוב מאוד:** בכל פעם שמדברים על אחד מהנושאים הבאים של Claude Code:
- Skills
- Commands
- Agents
- CLAUDE.md
- Hooks

עליך להשתמש ב-`claude-code-guide` agent כדי לקבל מידע מדויק ועדכני לפני שאתה עונה או מבצע.
```

---

## 4. Installing html-to-pdf Skill

```
התקן את ה-skill של html-to-pdf מספריית aviz85.

הריצו את הפקודה הבאה בטרמינל:
npx add-skill aviz85/claude-skills-library -s html-to-pdf -y

אחרי ההתקנה, התקן את ה-dependencies:
cd .claude/skills/html-to-pdf && npm install

ואז תסביר לי איך להשתמש ב-skill הזה.
```

**Additional Commands:**
```bash
# List all available skills in the library
npx add-skill aviz85/claude-skills-library --list

# Install skill globally (for all projects)
npx add-skill aviz85/claude-skills-library -s html-to-pdf -g
```

---

## 5. Creating First Quotation

```
קרא את קובץ ה-CRM ומצא לקוח שמתאים לקורס AI למתחילים.

צור לו הצעת מחיר מקצועית בעברית שכוללת:
- פרטי הלקוח
- תיאור המוצר
- מחיר והנחה אפשרית
- תנאי תשלום
- תוקף ההצעה

השתמש ב-html-to-pdf skill כדי ליצור PDF מעוצב.
שמור את הקובץ בתיקיית documents/
```

---

## 6. Creating Custom Quotation Skill

```
צור skill חדש בשם "create-quotation" שייצור הצעות מחיר.

לפני שאתה יוצר, השתמש ב-claude-code-guide agent כדי ללמוד איך ליצור skill נכון.

הSkill צריך:
1. לקבל שם לקוח ומוצר
2. לקרוא את פרטי הלקוח מה-CRM
3. ליצור HTML מעוצב עם:
   - כותרת "הצעת מחיר"
   - תאריך ומספר הצעה
   - פרטי לקוח
   - טבלת מוצרים ומחירים
   - סה"כ לתשלום
   - תנאים והגבלות
4. להשתמש ב-html-to-pdf skill ליצירת ה-PDF
5. לשמור בתיקיית documents/quotations/

העיצוב: צבעים ירוקים (#22C55E), פונט נקי, RTL
```

---

## 7. Adding Logo to Quotation Skill

```
עדכן את ה-skill של create-quotation כך שישתמש בלוגו:

1. הלוגו נמצא ב: assets/company_logo.png
2. הוסף את הלוגו בראש כל הצעת מחיר
3. עדכן את ה-CLAUDE.md עם נתיב הלוגו

בדוק שהכל עובד על ידי יצירת הצעת מחיר חדשה.
```

---

## 8. Setting Up Products Project

```
זהו פרויקט לניהול קטלוג המוצרים שלנו.

צור CLAUDE.md עם:
- תיאור הפרויקט (קטלוג קורסים וסדנאות AI)
- מבנה התיקיות (products/ עם תת-תיקייה לכל מוצר)
- כל מוצר מכיל product.md ו-ad.jpg

סרוק את המוצרים הקיימים ותן לי סיכום של מה יש לנו.
```

---

## 9. GOLDEN STEP: Generate Recommendations Agent

```
צור skill חדש בשם "generate-recommendations" שעושה את הדבר הבא:

1. קורא את נתוני הלקוחות מ-mock_crm_data.xlsx
2. קורא את קטלוג המוצרים מתיקיית my-products (השתמש ב-/add-dir להוסיף אותה)
3. לכל לקוח, מנתח:
   - מה הוא כבר קנה (היסטוריית רכישות)
   - מה תחומי העניין שלו (פרופיל מורחב)
   - מה הסטטוס שלו (VIP? ליד חדש?)
4. מייצר המלצות מותאמות אישית:
   - איזה מוצר להציע לו (upsale)
   - הודעת וואטסאפ מותאמת בעברית
   - סיבה להמלצה

לפני שאתה יוצר את ה-skill, השתמש ב-claude-code-guide agent כדי ללמוד איך ליצור skill שמשתמש ב-/add-dir לעבודה חוצת פרויקטים.

הפלט: קובץ recommendations.md עם טבלה של כל הלקוחות וההמלצות שלהם.
```

---

## 10. Running the Recommendations Skill

```
/generate-recommendations

הרץ את הסוכן וצור המלצות לכל הלקוחות.
```

---

## 11. Bonus: Preview Personalized Messages

```
קרא את קובץ ההמלצות שיצרנו.
בחר 3 לקוחות VIP והצג לי את ההודעות המותאמות שלהם.

(רק להצגה - בלי לשלוח באמת!)
```

---

## Quick Reference: add-skill Commands

| Command | Description |
|---------|-------------|
| `npx add-skill <repo> --list` | Show available skills |
| `npx add-skill <repo> -s <skill>` | Install one skill (project) |
| `npx add-skill <repo> -s <skill> -g` | Install one skill (global) |
| `npx add-skill <repo> -a claude-code` | Target Claude Code |
| `npx add-skill <repo> -y` | Skip confirmation prompts |

**Example: Full installation**
```bash
# 1. Install the skill globally for Claude Code
npx add-skill aviz85/claude-skills-library -s html-to-pdf -g -a claude-code -y

# 2. Install npm dependencies
cd ~/.claude/skills/html-to-pdf && npm install

# 3. Done! Claude Code will now auto-detect and use the skill
```
