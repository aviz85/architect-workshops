# Installation Wizard Prompt

הפרומפט המדויק להעתקה והדבקה לתוך Agent (כמו v0.dev, Bolt.new, או GPT-Engineer).

הפרומפט כתוב כך שה-Agent יבין את המבנה הטכני הנדרש, אך ייצר את כל התוכן והממשק בעברית מלאה (RTL) המותאמת למשתמשים לא טכניים.

---

```text
Create a site that functions as an interactive step-by-step tutorial wizard for installing "Claude Code" on Windows.

The site must be fully in Hebrew and use RTL (Right-to-Left) layout.
Design style: Clean, modern, friendly for non-tech users (similar to a Typeform or an Installation Wizard).

Key Features:
1. Progress Bar: Show the user which step they are on (1/12).
2. Split Layout:
   - Left side: A placeholder for a video clip (16:9 aspect ratio) with a caption "Video Placeholder".
   - Right side: Clear title, numbered instructions, and a code block (if needed).
3. Navigation: A large primary button at the bottom saying "ביצעתי, לשלב הבא" (Done, Next Step) to advance. A "חזור" (Back) button for previous steps.
4. Completion: A celebration screen at the end.

Here is the exact content for the 12 steps. Please implement this content into the state:

Step 1:
Title: "שלב 1: הורדת התוכנה הבסיסית (Node.js)"
Instructions:
1. פתחו דפדפן וחפשו בגוגל: Node js
2. היכנסו לתוצאה הראשונה (nodejs.org).
3. הורידו את גרסת ה-LTS (הכפתור השמאל הירוק).
4. פתחו את הקובץ שירד.

Step 2:
Title: "שלב 2: התקנת Node.js"
Instructions:
1. באשף ההתקנה, לחצו Next ואשרו את התנאים.
2. השאירו את כל ההגדרות כברירת מחדל.
3. חשוב מאוד: במסך 'Tools for Native Modules' אל תסמנו את התיבה! השאירו אותה ריקה.
4. לחצו Install ואז Finish.

Step 3:
Title: "שלב 3: פתיחת הטרמינל"
Instructions:
1. לחצו על מקש ה-Windows במקלדת.
2. הקלידו: cmd
3. לחצו Enter כדי לפתוח את החלון השחור.

Step 4:
Title: "שלב 4: התקנת Claude Code"
Instructions:
1. העתיקו את הפקודה למטה.
2. הדביקו אותה בחלון השחור ולחצו Enter.
Code to copy: npm install -g @anthropic-ai/claude-code

Step 5:
Title: "שלב 5: הורדת Git"
Instructions:
1. חזרו לגוגל וחפשו: git scm
2. היכנסו לתוצאה הראשונה ולחצו על 'Download for Windows'.
3. בחרו באפשרות: 64-bit Git for Windows Setup.

Step 6:
Title: "שלב 6: התקנת Git"
Instructions:
1. הפעילו את הקובץ שהורדתם.
2. לחצו Next שוב ושוב (אין צורך לשנות הגדרות).
3. בסיום לחצו Install.

Step 7:
Title: "שלב 7: יצירת תיקיית עבודה"
Instructions:
1. גשו לשולחן העבודה.
2. צרו תיקייה חדשה (קליק ימני > חדש > תיקייה).
3. תנו לתיקייה שם באנגלית, למשל: test

Step 8:
Title: "שלב 8: הפעלת התוכנה"
Instructions:
1. חזרו לחלון השחור (CMD).
2. כתבו cd וגררו את התיקייה שיצרתם לתוך החלון (כדי להעתיק את המיקום שלה).
3. לחצו Enter.
4. כעת כתבו: claude ולחצו Enter.

Step 9:
Title: "שלב 9: הגדרות ראשוניות"
Instructions:
1. בחרו ערכת נושא (למשל Dark Mode) עם החצים ולחצו Enter.
2. בחרו באפשרות השנייה: Claude account with subscription ולחצו Enter.

Step 10:
Title: "שלב 10: אישור חיבור"
Instructions:
1. בדפדפן שנפתח, לחצו על כפתור Authorize.
2. הערה: נדרש מנוי בתשלום (Pro).
3. כשתופיע ההודעה "You're all set up", סגרו את הדפדפן.

Step 11:
Title: "שלב 11: אישור תנאים סופי"
Instructions:
1. חזרו לחלון השחור.
2. לחצו Enter כדי לאשר את תנאי השימוש.
3. זהו! אפשר להתחיל לעבוד.

Step 12:
Title: "בונוס: הגדרות פרטיות"
Instructions:
1. גשו לאתר claude.ai
2. לחצו על האייקון שלכם > Settings > Privacy.
3. כבו את המתג: Help improve Claude כדי שהמידע שלכם יישאר פרטי.

```
