import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(projectRoot, "..");
const workshopsRoot = path.join(repoRoot, "workshops");
const entryPoint = path.join(projectRoot, "remotion", "index.jsx");
const brandPath = path.join(repoRoot, "brand", "avatars", "aviz-logo.png");

const args = new Set(process.argv.slice(2));
const onlyArg = process.argv.find(arg => arg.startsWith("--only="));
const limitArg = process.argv.find(arg => arg.startsWith("--limit="));
const overwrite = args.has("--overwrite");
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").filter(Boolean)) : null;
const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : Infinity;

function extractTitle(markdown, fallback) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function extractField(markdown, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = markdown.match(new RegExp(`^-\\s*${escaped}:\\s*(.+)$`, "im"));
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function inferDateFromSlug(slug) {
  return slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "";
}

function inferStatus(dateValue) {
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

async function listWorkshops() {
  const entries = await fs.readdir(workshopsRoot, { withFileTypes: true });
  const workshops = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (only && !only.has(entry.name)) continue;

    const markdownPath = path.join(workshopsRoot, entry.name, "workshop.md");
    try {
      const markdown = await fs.readFile(markdownPath, "utf8");
      const date = extractField(markdown, ["Date", "date", "תאריך"]) || inferDateFromSlug(entry.name);
      workshops.push({
        slug: entry.name,
        title: extractTitle(markdown, entry.name),
        date,
        time: extractField(markdown, ["Time", "time", "שעה"]) || "20:00",
        price: extractField(markdown, ["Price", "price", "מחיר"]) || "₪100",
        status: inferStatus(date)
      });
    } catch {
      // Folders without workshop.md are not workshop records.
    }
  }

  return workshops
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, limit);
}

async function toDataUri(filePath) {
  const bytes = await fs.readFile(filePath);
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

const workshops = await listWorkshops();

if (workshops.length === 0) {
  console.log("No workshops matched.");
  process.exit(0);
}

console.log(`Bundling Remotion project for ${workshops.length} workshop(s)...`);
const serveUrl = await bundle({ entryPoint });
const brandDataUri = await toDataUri(brandPath);

let rendered = 0;
let skipped = 0;

for (const workshop of workshops) {
  const assetsDir = path.join(workshopsRoot, workshop.slug, "assets");
  const outputLocation = path.join(assetsDir, "workshop-promo.mp4");

  try {
    await fs.access(outputLocation);
    if (!overwrite) {
      console.log(`skip ${workshop.slug} (already exists)`);
      skipped += 1;
      continue;
    }
  } catch {
    // File does not exist yet.
  }

  await fs.mkdir(assetsDir, { recursive: true });

  const inputProps = { workshop, brandDataUri };
  const composition = await selectComposition({
    serveUrl,
    id: "WorkshopPromo",
    inputProps
  });

  console.log(`render ${workshop.slug} -> ${path.relative(repoRoot, outputLocation)}`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    imageFormat: "jpeg",
    inputProps,
    outputLocation,
    chromiumOptions: {
      gl: "angle"
    }
  });
  rendered += 1;
}

console.log(`Done. rendered=${rendered} skipped=${skipped}`);
