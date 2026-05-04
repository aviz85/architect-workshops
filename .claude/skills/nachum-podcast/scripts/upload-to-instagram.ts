import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import minimist from "minimist";

// ── Config ──────────────────────────────────────────────────────────────────

// Load .env from the same directory as this script
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const envPath = path.join(scriptDir, ".env");
if (fs.existsSync(envPath)) {
  // Re-import dotenv to load from specific path
  const dotenv = await import("dotenv");
  dotenv.config({ path: envPath, override: true });
}

const IG_USER_ID = process.env.IG_USER_ID;
const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const API_BASE = "https://graph.facebook.com/v21.0";

if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  console.error(
    "Missing IG_USER_ID or IG_ACCESS_TOKEN. Set them in .env or environment."
  );
  process.exit(1);
}

// ── CLI args ────────────────────────────────────────────────────────────────

const argv = minimist(process.argv.slice(2));
const videoPath = argv._[0];
const caption = argv._[1] ?? "";

if (!videoPath) {
  console.error(
    "Usage: npx tsx upload-to-instagram.ts <video-path> [caption]"
  );
  process.exit(1);
}

const absVideoPath = path.resolve(videoPath);
if (!fs.existsSync(absVideoPath)) {
  console.error(`File not found: ${absVideoPath}`);
  process.exit(1);
}

const fileStat = fs.statSync(absVideoPath);
const fileSize = fileStat.size;
console.log(
  `Uploading: ${absVideoPath} (${(fileSize / 1024 / 1024).toFixed(1)} MB)`
);
if (caption) console.log(`Caption: ${caption}`);

// ── Step 1: Create media container (resumable) ─────────────────────────────

console.log("\n[1/4] Creating media container...");

const createParams = new URLSearchParams({
  media_type: "REELS",
  upload_type: "resumable",
  access_token: IG_ACCESS_TOKEN,
});
if (caption) createParams.set("caption", caption);

const createRes = await fetch(
  `${API_BASE}/${IG_USER_ID}/media?${createParams}`,
  { method: "POST" }
);
const createData = (await createRes.json()) as {
  id?: string;
  uri?: string;
  error?: { message: string; code: number };
};

if (createData.error || !createData.id || !createData.uri) {
  console.error("Failed to create media container:", createData);
  process.exit(1);
}

const containerId = createData.id;
const uploadUri = createData.uri;
console.log(`Container ID: ${containerId}`);

// ── Step 2: Upload video binary ─────────────────────────────────────────────

console.log("[2/4] Uploading video binary...");

const videoBuffer = fs.readFileSync(absVideoPath);

const uploadRes = await fetch(uploadUri, {
  method: "POST",
  headers: {
    Authorization: `OAuth ${IG_ACCESS_TOKEN}`,
    offset: "0",
    file_size: String(fileSize),
    "Content-Type": "application/octet-stream",
  },
  body: videoBuffer,
});

const uploadData = (await uploadRes.json()) as {
  h?: string;
  error?: { message: string };
};

if (uploadData.error) {
  console.error("Upload failed:", uploadData);
  process.exit(1);
}

console.log(`Upload complete. File handle: ${uploadData.h ?? "ok"}`);

// ── Step 3: Poll status until FINISHED ──────────────────────────────────────

console.log("[3/4] Waiting for processing...");

const POLL_INTERVAL_MS = 5000;
const MAX_POLLS = 120; // 10 minutes max

for (let i = 0; i < MAX_POLLS; i++) {
  await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

  const statusRes = await fetch(
    `${API_BASE}/${containerId}?fields=status_code,status&access_token=${IG_ACCESS_TOKEN}`
  );
  const statusData = (await statusRes.json()) as {
    status_code?: string;
    status?: string;
    error?: { message: string };
  };

  const code = statusData.status_code;
  process.stdout.write(`  Poll ${i + 1}: ${code ?? "unknown"}\r`);

  if (code === "FINISHED") {
    console.log(`  Processing complete after ${(i + 1) * 5}s`);
    break;
  }

  if (code === "ERROR") {
    console.error("\nProcessing failed:", statusData);
    process.exit(1);
  }

  if (i === MAX_POLLS - 1) {
    console.error("\nTimed out waiting for processing.");
    process.exit(1);
  }
}

// ── Step 4: Publish ─────────────────────────────────────────────────────────

console.log("[4/4] Publishing reel...");

const publishRes = await fetch(
  `${API_BASE}/${IG_USER_ID}/media_publish`,
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      creation_id: containerId,
      access_token: IG_ACCESS_TOKEN,
    }),
  }
);
const publishData = (await publishRes.json()) as {
  id?: string;
  error?: { message: string; code: number };
};

if (publishData.error || !publishData.id) {
  console.error("Publish failed:", publishData);
  process.exit(1);
}

console.log(`\nPublished! Media ID: ${publishData.id}`);
