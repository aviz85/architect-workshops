#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

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
node render-contract-pdf.mjs --html contract.html --pdf contract.pdf [--preview preview.png] [--chrome /path/to/Chrome]
`);
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(path.resolve(filePath)), { recursive: true });
}

function loadPlaywright() {
  const attempts = [
    () => require("playwright"),
    () => require("/Users/aviz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"),
  ];

  for (const attempt of attempts) {
    try {
      return attempt();
    } catch {
      // Try the next known location.
    }
  }

  throw new Error("Could not load Playwright. Run with NODE_PATH pointing at the Codex bundled node_modules.");
}

function chromeCandidates(explicitPath) {
  return [
    explicitPath,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);
}

async function launchBrowser(chromium, explicitChrome) {
  try {
    return await chromium.launch({ headless: true });
  } catch (firstError) {
    for (const candidate of chromeCandidates(explicitChrome)) {
      if (!fs.existsSync(candidate)) continue;
      try {
        return await chromium.launch({
          headless: true,
          executablePath: candidate,
        });
      } catch {
        // Try next candidate.
      }
    }
    throw firstError;
  }
}

const args = parseArgs(process.argv);

if (!args.html || !args.pdf) {
  usage();
  process.exit(2);
}

const htmlPath = path.resolve(args.html);
const pdfPath = path.resolve(args.pdf);
const previewPath = args.preview ? path.resolve(args.preview) : null;

if (!fs.existsSync(htmlPath)) {
  console.error(`HTML file not found: ${htmlPath}`);
  process.exit(1);
}

ensureParent(pdfPath);
if (previewPath) ensureParent(previewPath);

const { chromium } = loadPlaywright();
const browser = await launchBrowser(chromium, args.chrome);

try {
  const page = await browser.newPage({
    viewport: { width: 1240, height: 1754 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      right: "18mm",
      bottom: "20mm",
      left: "18mm",
    },
  });

  if (previewPath) {
    await page.screenshot({ path: previewPath, fullPage: true });
  }

  console.log(`PDF: ${pdfPath}`);
  if (previewPath) console.log(`Preview: ${previewPath}`);
} finally {
  await browser.close();
}

