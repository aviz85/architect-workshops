import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..");
const workshopsRoot = path.join(repoRoot, "workshops");

export function getWorkshopsRoot() {
  return workshopsRoot;
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\u0590-\u05ff\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64) || "new-workshop";
}

export function getDayInfo(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return { valid: false, label: "", day: -1, isShabbat: false };
  }

  const day = date.getDay();
  return {
    valid: true,
    day,
    label: new Intl.DateTimeFormat("he-IL", { weekday: "long" }).format(date),
    isShabbat: day === 5 || day === 6
  };
}

export function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || fallback;
}

export function extractField(markdown, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = markdown.match(new RegExp(`^-\\s*${escaped}:\\s*(.+)$`, "im"));
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

export function inferDateFromSlug(slug) {
  return slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

export function inferStatus(dateValue) {
  if (!dateValue) return "idea";

  const today = new Date();
  const todayMidday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const date = new Date(`${dateValue}T12:00:00`);
  const days = Math.round((date - todayMidday) / 86400000);

  if (days === 0) return "live";
  if (days > 0 && days <= 7) return "marketing";
  if (days > 7) return "prep";
  if (days < 0 && days >= -10) return "followup";
  return "archive";
}

export async function listWorkshops() {
  const entries = await fs.readdir(workshopsRoot, { withFileTypes: true });
  const rows = await Promise.all(entries
    .filter(entry => entry.isDirectory())
    .map(async entry => {
      const slug = entry.name;
      const filePath = path.join(workshopsRoot, slug, "workshop.md");
      try {
        const markdown = await fs.readFile(filePath, "utf8");
        const date = extractField(markdown, ["Date", "date", "תאריך"]) || inferDateFromSlug(slug);
        return {
          slug,
          title: extractTitle(markdown, slug),
          date,
          time: extractField(markdown, ["Time", "time", "שעה"]) || "20:00",
          price: extractField(markdown, ["Price", "price", "מחיר"]) || "₪100",
          platform: extractField(markdown, ["Platform", "platform"]) || "Zoom",
          audience: extractField(markdown, ["Audience", "audience", "קהל יעד"]),
          status: inferStatus(date),
          path: path.relative(repoRoot, filePath),
          updatedAt: (await fs.stat(filePath)).mtime.toISOString()
        };
      } catch {
        return null;
      }
    }));

  return rows
    .filter(Boolean)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function readWorkshop(slug) {
  const safeSlug = path.basename(slug);
  const filePath = path.join(workshopsRoot, safeSlug, "workshop.md");
  const markdown = await fs.readFile(filePath, "utf8");
  return {
    slug: safeSlug,
    markdown,
    workshop: (await listWorkshops()).find(item => item.slug === safeSlug)
  };
}

export function buildWorkshopMarkdown(input) {
  const title = input.title?.trim() || "סדנה חדשה";
  const date = input.date || "";
  const time = input.time || "20:00";
  const audience = input.audience?.trim() || "בעלי עסקים ומנהלים";
  const promise = input.promise?.trim() || "סדנה פרקטית עם תוצאה מוחשית בסוף המפגש.";
  const price = input.price?.trim() || "₪100";

  return `# ${title}

---

## Logistics

- Date: ${date}
- Time: ${time}
- Platform: Zoom
- Price: ${price}
- Audience: ${audience}
- Registration: https://linktr.ee/aviz85

---

## Promise

${promise}

---

## Agenda

1. פתיחה: למה הסדנה הזו עכשיו
2. הדגמה חיה: תוצאה מוחשית תוך דקות
3. מסגרת עבודה: איך לחשוב על התהליך
4. תרגול: כל משתתף מנסח משימה או תהליך משלו
5. נכס שנשאר: צ'קליסט / Skill / בריף מוכן להפעלה
6. סגירה: המשך עבודה, שיתוף תוצרים, סדנה הבאה

---

## Materials

- [ ] Poster
- [ ] WhatsApp announcement
- [ ] Presentation plan
- [ ] Live prep checklist
- [ ] Follow-up message
- [ ] Metrics and testimonials
`;
}

export async function createWorkshop(input) {
  const dayInfo = getDayInfo(input.date);
  if (dayInfo.isShabbat && !input.confirmShabbat) {
    const error = new Error(`${input.date} יוצא ${dayInfo.label}. שישי/שבת דורש אישור מפורש מדלית.`);
    error.status = 409;
    throw error;
  }

  const slug = `${input.date}-${slugify(input.title)}`;
  const folder = path.join(workshopsRoot, slug);
  await fs.mkdir(folder, { recursive: false });
  const markdown = buildWorkshopMarkdown(input);
  await fs.writeFile(path.join(folder, "workshop.md"), markdown, "utf8");
  return { slug, markdown };
}

export async function updateWorkshop(slug, markdown) {
  const safeSlug = path.basename(slug);
  const filePath = path.join(workshopsRoot, safeSlug, "workshop.md");
  await fs.writeFile(filePath, markdown, "utf8");
  return readWorkshop(safeSlug);
}

export function buildMaterials({ title, date, time, promise }) {
  const safeTitle = title || "סדנת AVIZ";
  const safePromise = promise || "סדנה פרקטית עם תוצאה מוחשית.";
  return {
    poster: `Create a premium Hebrew RTL workshop poster for AVIZ.
Headline: ${safeTitle}
Promise: ${safePromise}
Details: Zoom | ${date || "TBD"} | ${time || "20:00"} | ₪100 | linktr.ee/aviz85
Visual direction: elegant, accessible, vivid green #22C55E, dark architectural layout, hot-pink accent, Aviz Architect avatar, large readable Hebrew type.`,
    slides: `תוכנית מצגת RTL עבור "${safeTitle}":
1. פתיחה חזקה: למה הנושא חשוב עכשיו.
2. הדגמה חיה אחת שמייצרת אמון.
3. מודל עבודה פשוט שאפשר לזכור.
4. תרגיל משתתפים עם תוצר אישי.
5. בניית נכס שנשאר אחרי הסדנה.
6. סגירה: 24 שעות קדימה והצעה להמשך.`,
    whatsapp: `חברים, ב-${date || "תאריך יפורסם"} בשעה ${time || "20:00"} אני מעביר את "${safeTitle}".
${safePromise}
עלות: ₪100
הרשמה וכל הלינקים: https://linktr.ee/aviz85`,
    followup: `תודה ענקית למי שהגיע ל-"${safeTitle}".
מצורפים חומרים, הקלטה/קישורים, ומשימת המשך אחת כדי להפוך את מה שלמדנו לנכס קבוע.
המשימה: לבחור פעולה אחת שחוזרת אצלכם ולהפוך אותה לבריף שאפשר להפעיל שוב.`
  };
}
