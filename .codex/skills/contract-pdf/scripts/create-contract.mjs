#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const renderScript = path.join(__dirname, "render-contract-pdf.mjs");

const brand = {
  hebrewName: "אביץ הארכיטקט",
  englishName: "AVIZ - The Architect",
  legalName: "אברהם יצחק מאיר",
  businessType: "עוסק מורשה",
  id: "021678206",
  email: "avizmaeir@gmail.com",
  phone: "050-3973736",
  linktree: "linktr.ee/aviz85",
  logoPath: "/Users/aviz/architect-workshops/brand/avatars/aviz-logo.png",
};

const weekdayHebrew = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  timeZone: "Asia/Jerusalem",
});

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function usage() {
  console.error(`Usage:
node create-contract.mjs --data contract.json [--out-dir /Users/aviz/Documents/contracts] [--render]

Outputs:
- <slug>.html
- <slug>.validation.json
- with --render: <slug>.pdf and <slug>-preview.png
`);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatIls(amount) {
  if (amount === undefined || amount === null || amount === "") return "__________";
  return new Intl.NumberFormat("he-IL").format(Number(amount));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(value) {
  const raw = String(value || "contract")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9א-ת]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return raw || "contract";
}

function localDate(dateString) {
  const [year, month, day] = String(dateString).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function actualWeekdayHebrew(dateString) {
  const date = localDate(dateString);
  if (!date) return null;
  return weekdayHebrew.format(date);
}

function validate(data) {
  const errors = [];
  const warnings = [];
  const meta = data.meta || {};

  if (!meta.isDemo && !data.client?.name) errors.push("Missing client.name for a real contract.");
  if (!meta.isDemo && !data.payment?.amount) warnings.push("Missing payment.amount.");
  if (meta.isDemo !== true && hasDemoSignals(data)) {
    warnings.push("Document has demo-like client data but meta.isDemo is not true.");
  }

  if (data.logistics?.date) {
    const actual = actualWeekdayHebrew(data.logistics.date);
    const expected = normalizeWeekday(data.logistics.weekdayHebrew);
    if (actual && expected && normalizeWeekday(actual) !== expected) {
      errors.push(`Weekday mismatch: ${data.logistics.date} is ${actual}, not ${expected}.`);
    }
    const day = localDate(data.logistics.date)?.getUTCDay();
    if (!meta.isDemo && (day === 5 || day === 6) && meta.shabbatApproved !== true) {
      errors.push("Real contract date falls on Friday/Saturday and meta.shabbatApproved is not true.");
    }
  }

  if (meta.isDemo === true && data.contract?.demoNotice === false) {
    warnings.push("Demo contract suppresses the demo notice.");
  }

  return { ok: errors.length === 0, errors, warnings };
}

function normalizeWeekday(value) {
  if (!value) return null;
  return String(value).replace(/^יום\s+/, "");
}

function hasDemoSignals(data) {
  const text = JSON.stringify(data);
  return /דוגמה|demo|515555555|050-0000000/.test(text);
}

function paragraph(text) {
  return `<p>${escapeHtml(text)}</p>`;
}

function list(items) {
  const safeItems = Array.isArray(items) ? items : [];
  if (!safeItems.length) return "<p>__________</p>";
  return `<ol>${safeItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n")}</ol>`;
}

function contactLine(client) {
  const parts = [
    client?.name,
    client?.taxId ? `ח.פ. ${client.taxId}` : null,
    client?.address,
    client?.contactName ? `איש קשר: ${client.contactName}` : null,
    client?.contactRole,
  ].filter(Boolean);
  return parts.join(", ") || "__________";
}

function documentDate(meta) {
  return meta?.documentDate || new Date().toISOString().slice(0, 10);
}

function dateDisplay(dateString) {
  if (!dateString) return "__________";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

function buildHtml(data, validation) {
  const meta = data.meta || {};
  const contract = data.contract || {};
  const client = data.client || {};
  const service = data.service || {};
  const logistics = data.logistics || {};
  const payment = data.payment || {};
  const signatures = data.signatures || {};
  const isDemo = meta.isDemo === true;
  const notice = isDemo
    ? "מסמך זה הוא דוגמה בלבד, עם פרטי לקוח ותנאים פיקטיביים. אין לראות בו ייעוץ משפטי או נוסח סופי לשימוש מול לקוח אמיתי ללא בדיקה והתאמה."
    : "טיוטת הסכם זו נועדה לבדיקה ואישור הצדדים. מומלץ לבצע בדיקה משפטית לפני חתימה.";

  const warningsHtml = validation.warnings.length
    ? `<div class="warning">${validation.warnings.map(escapeHtml).join("<br>")}</div>`
    : "";

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(contract.title || "הסכם התקשרות")}</title>
  <style>
    @page { size: A4; margin: 20mm 18mm; }
    * { box-sizing: border-box; }
    :root {
      --aviz-green: #22C55E;
      --aviz-green-dark: #16A34A;
      --ink: #111827;
      --text: #1f2937;
      --muted: #4b5563;
      --line: #d1d5db;
      --soft: #f9fafb;
      --soft-green: #f0fdf4;
    }
    html, body {
      direction: rtl;
      margin: 0;
      padding: 0;
      color: var(--text);
      background: #fff;
      font-family: Arial, "Noto Sans Hebrew", "Noto Sans", sans-serif;
      font-size: 13px;
      line-height: 1.65;
      text-align: right;
    }
    .document { width: 100%; }
    .topbar {
      border-bottom: 5px solid var(--aviz-green);
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }
    .brand-main {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .logo-mark {
      width: 76px;
      height: 76px;
      object-fit: contain;
      flex: 0 0 auto;
    }
    .brand-name {
      font-size: 19px;
      font-weight: 700;
      color: var(--ink);
      line-height: 1.2;
    }
    .brand-tagline {
      margin-top: 4px;
      color: var(--aviz-green-dark);
      font-size: 12px;
      font-weight: 700;
    }
    .brand-details {
      margin-top: 5px;
      color: var(--muted);
      font-size: 12px;
    }
    .meta {
      color: var(--muted);
      font-size: 12px;
      text-align: left;
      direction: ltr;
      border-right: 1px solid #e5e7eb;
      padding-right: 18px;
    }
    h1 {
      margin: 22px 0 8px;
      color: var(--ink);
      font-size: 26px;
      line-height: 1.25;
      text-align: center;
      letter-spacing: 0;
    }
    .subtitle {
      margin: 0 0 24px;
      color: var(--muted);
      text-align: center;
      font-size: 13px;
      font-weight: 700;
    }
    .notice, .warning {
      border: 1px solid #86efac;
      background: var(--soft-green);
      color: #14532d;
      border-right: 5px solid var(--aviz-green);
      padding: 10px 14px;
      margin: 0 0 18px;
      font-weight: 700;
    }
    .warning {
      border-color: #fde68a;
      border-right-color: #f59e0b;
      background: #fffbeb;
      color: #92400e;
    }
    .section { break-inside: avoid; margin: 0 0 18px; }
    h2 {
      margin: 0 0 8px;
      color: var(--ink);
      font-size: 16px;
      line-height: 1.35;
      border-bottom: 1px solid var(--line);
      padding-bottom: 4px;
    }
    h2::after {
      content: "";
      display: block;
      width: 44px;
      height: 3px;
      background: var(--aviz-green);
      margin-top: 5px;
    }
    p { margin: 0 0 8px; }
    ol { margin: 0; padding: 0 22px 0 0; }
    li { margin: 0 0 6px; padding-right: 2px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 0;
      table-layout: fixed;
    }
    th, td {
      border: 1px solid var(--line);
      padding: 8px 10px;
      vertical-align: top;
    }
    th {
      width: 28%;
      background: var(--soft);
      color: var(--ink);
      font-weight: 700;
    }
    .ltr { direction: ltr; text-align: left; unicode-bidi: embed; }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      margin-top: 38px;
      break-inside: avoid;
    }
    .signature-box {
      min-height: 92px;
      border-top: 2px solid var(--ink);
      padding-top: 8px;
    }
    .signature-title {
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 18px;
    }
    .footer {
      margin-top: 28px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 11px;
      text-align: center;
    }
    .footer strong { color: var(--aviz-green-dark); }
  </style>
</head>
<body>
  <main class="document">
    <header class="topbar">
      <div class="brand">
        <div class="brand-main">
          <img class="logo-mark" src="file://${brand.logoPath}" alt="AVIZ">
          <div>
            <div class="brand-name">${escapeHtml(brand.hebrewName)}</div>
            <div class="brand-tagline">${escapeHtml(brand.englishName)}</div>
            <div class="brand-details">${escapeHtml(brand.legalName)} | ${escapeHtml(brand.businessType)} | סדנאות, הרצאות ומערכות AI</div>
          </div>
        </div>
        <div class="meta">
          ${escapeHtml(brand.email)}<br>
          ${escapeHtml(brand.phone)}<br>
          ${escapeHtml(brand.linktree)}<br>
          Date: ${escapeHtml(dateDisplay(documentDate(meta)))}
        </div>
      </div>
    </header>

    <h1>${escapeHtml(contract.title || "הסכם התקשרות")}</h1>
    <p class="subtitle">${escapeHtml(contract.subtitle || "מסמך התקשרות ממותג")}</p>

    <div class="notice">${escapeHtml(notice)}</div>
    ${warningsHtml}

    <section class="section">
      <h2>1. הצדדים להסכם</h2>
      <table>
        <tr>
          <th>נותן השירות</th>
          <td>${escapeHtml(brand.legalName)}, ${escapeHtml(brand.businessType)}, ת.ז. ${escapeHtml(brand.id)}, הפועל תחת המותג ${escapeHtml(brand.englishName)}.</td>
        </tr>
        <tr>
          <th>מקבל השירות</th>
          <td>${escapeHtml(contactLine(client))}</td>
        </tr>
      </table>
    </section>

    <section class="section">
      <h2>2. מהות השירות והיקף העבודה</h2>
      ${paragraph(service.summary || "__________")}
      ${list(service.deliverables)}
      ${(service.exclusions || []).length ? `<p><strong>לא כלול:</strong></p>${list(service.exclusions)}` : ""}
    </section>

    <section class="section">
      <h2>3. מועד ואופן ביצוע</h2>
      <table>
        <tr><th>מועד</th><td>${escapeHtml(logistics.weekdayHebrew || actualWeekdayHebrew(logistics.date) || "")}, ${escapeHtml(dateDisplay(logistics.date))}</td></tr>
        <tr><th>שעה</th><td>${escapeHtml(logistics.time || "__________")}</td></tr>
        <tr><th>משך</th><td>${escapeHtml(logistics.duration || "__________")}</td></tr>
        <tr><th>אופן ביצוע</th><td>${escapeHtml(logistics.location || "__________")}</td></tr>
        <tr><th>משתתפים</th><td>${escapeHtml(logistics.participants || "__________")}</td></tr>
      </table>
    </section>

    <section class="section">
      <h2>4. תמורה ותנאי תשלום</h2>
      <ol>
        <li>התמורה עבור השירות תהיה ${formatIls(payment.amount)} ש״ח ${escapeHtml(payment.vat || "בתוספת מע״מ כדין")}.</li>
        <li>${escapeHtml(payment.deposit || "מקדמה ותנאי תשלום יסוכמו בכתב בין הצדדים.")}</li>
        <li>${escapeHtml(payment.balance || "יתרת התשלום תשולם בהתאם לסיכום בין הצדדים.")}</li>
        <li>${escapeHtml(payment.invoice || "חשבונית מס/קבלה תופק בהתאם לדין לאחר קבלת התשלום בפועל.")}</li>
      </ol>
    </section>

    <section class="section">
      <h2>5. אחריות הצדדים</h2>
      <ol>
        <li>נותן השירות אחראי להכנת תכני השירות, הנחייתו ומתן מענה מקצועי במסגרת הזמן שהוגדרה.</li>
        <li>מקבל השירות אחראי לוודא שהמשתתפים מקבלים את פרטי ההתחברות ונכנסים בזמן.</li>
        <li>מקבל השירות ימסור מראש לנותן השירות דגשים מקצועיים, קהל יעד ומטרות ארגוניות רלוונטיות.</li>
      </ol>
    </section>

    <section class="section">
      <h2>6. ביטול או דחייה</h2>
      ${list(data.cancellation)}
    </section>

    <section class="section">
      <h2>7. זכויות יוצרים ושימוש בחומרים</h2>
      ${list(data.rights)}
    </section>

    <section class="section">
      <h2>8. סודיות</h2>
      ${paragraph(data.confidentiality || "כל צד מתחייב לשמור בסודיות מידע עסקי, מקצועי או אישי שנחשף במסגרת ההתקשרות, ולא להעבירו לצדדים שלישיים ללא הסכמה מראש, למעט אם הדבר נדרש לפי דין.")}
    </section>

    <section class="section">
      <h2>9. שונות</h2>
      ${list(data.additionalTerms)}
    </section>

    <section class="signatures">
      <div class="signature-box">
        <div class="signature-title">חתימת נותן השירות</div>
        שם: ${escapeHtml(signatures.providerName || brand.legalName)}<br>
        תאריך: _______________<br>
        חתימה: _______________
      </div>
      <div class="signature-box">
        <div class="signature-title">חתימת מקבל השירות</div>
        שם: ${escapeHtml(signatures.clientName || client.name || "__________")}<br>
        תאריך: _______________<br>
        חתימה: _______________
      </div>
    </section>

    <div class="footer">
      מסמך שנוצר עבור <strong>${escapeHtml(brand.englishName)}</strong> | ${isDemo ? "דוגמה בלבד" : "טיוטה לאישור"}
    </div>
  </main>
</body>
</html>
`;
}

function runRender({ htmlPath, pdfPath, previewPath }) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      renderScript,
      "--html",
      htmlPath,
      "--pdf",
      pdfPath,
      "--preview",
      previewPath,
    ], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`render-contract-pdf exited with code ${code}`));
    });
  });
}

const args = parseArgs(process.argv);

if (!args.data) {
  usage();
  process.exit(2);
}

const dataPath = path.resolve(args.data);
const data = readJson(dataPath);
const validation = validate(data);
const outDir = path.resolve(args["out-dir"] || "/Users/aviz/Documents/contracts");
const slug = slugify(args.slug || data.meta?.slug || data.client?.name || "contract");
const htmlPath = path.join(outDir, `${slug}.html`);
const pdfPath = path.join(outDir, `${slug}.pdf`);
const previewPath = path.join(outDir, `${slug}-preview.png`);
const validationPath = path.join(outDir, `${slug}.validation.json`);

ensureDir(outDir);
fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);

if (!validation.ok && !args.force) {
  console.error(`Validation failed. See: ${validationPath}`);
  for (const error of validation.errors) console.error(`- ${error}`);
  process.exit(1);
}

const html = buildHtml(data, validation);
fs.writeFileSync(htmlPath, html);

console.log(`HTML: ${htmlPath}`);
console.log(`Validation: ${validationPath}`);
if (validation.warnings.length) {
  console.warn("Warnings:");
  for (const warning of validation.warnings) console.warn(`- ${warning}`);
}

if (args.render) {
  await runRender({ htmlPath, pdfPath, previewPath });
}
