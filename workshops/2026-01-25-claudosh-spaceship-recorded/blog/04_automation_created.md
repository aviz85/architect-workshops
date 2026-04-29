# אוטומציות שנוצרו

## Morning Payment Watcher (GAS)

### מיקום
```
https://script.google.com/d/1kmFPDuWOwtqKZfpNEpxZOBa6UjIrCwzGcEN6-Od6B9YU9wd6_fg7cdGq/edit
```

### מה עושה
1. רץ כל 5 דקות
2. מחפש מיילים מ-`notify@morning.co`
3. מסנן לפי מילת מפתח (למשל: "החללית של קלודוש")
4. מפרסר שם, מייל, טלפון
5. שולח וואטסאפ עם הזמנה לקבוצה
6. שולח מייל HTML מעוצב
7. מסמן את המייל כ-processed

### קונפיגורציה
```javascript
const WORKSHOP_KEYWORD = 'החללית של קלודוש';
const GROUP_INVITE_LINK = 'https://chat.whatsapp.com/...';
const WORKSHOP_NAME = 'קלודוש - מצב חללית';
```

### פונקציות זמינות
| פונקציה | תפקיד |
|---------|-------|
| `setup()` | יוצר טריגר |
| `removeTriggers()` | מבטל טריגרים |
| `checkMorningEmails()` | בדיקה ידנית |
| `testSendInvites()` | בדיקת שליחה |

### תוכן ההודעות

**וואטסאפ:**
```
היי [שם]! 🚀

תודה שנרשמת לסדנה: *קלודוש - מצב חללית*

הנה הקישור להצטרפות לקבוצת הוואטסאפ של הסדנה:
[LINK]

נתראה בסדנה! 🎉

-- אביץ הארכיטקט
```

**מייל:** (בלי אימוג'ים - לא נראה טוב)
- כותרת: "הצטרפות לקבוצת הסדנה - קלודוש - מצב חללית"
- HTML מעוצב עם כפתור ירוק

## סקיל פוסטרים מעודכן

### העדפות שנשמרו
```markdown
**FAVORITE STYLE - "Breaking Through":**
- Cinematic motion: Character BURSTING through
- Coming at viewer: Everything explodes TOWARD the viewer
- Shattered elements: Broken screens, glass shards
- Fourth wall break: Feels like character breaking out
```

### Aspect Ratio
- 3:2 לפוסטרים שיווקיים (תמיד!)
- 16:9 למצגות בלבד

## פרופיל משתמש מעודכן

### נוסף ל-CLAUDE.md
```markdown
- Nickname: אביץ (Hebrew) / Aviz (English)
- Email: avizmaeir@gmail.com
- Phone: 0503973736
- Wife: דלית
- Brand: AVIZ / אביץ הארכיטקט
```
