import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const allowed = new Set([
  "aviz-logo.png",
  "aviz-photo.png",
  "avatar-boss.png",
  "avatar-baby-boss.jpg",
  "avatar-classic.jpg"
]);

export async function GET(_request, { params }) {
  const { file } = await params;
  if (!allowed.has(file)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const repoRoot = path.resolve(process.cwd(), "..");
  const filePath = path.join(repoRoot, "brand", "avatars", file);
  const body = await fs.readFile(filePath);
  const ext = path.extname(file).toLowerCase();
  const type = ext === ".jpg" ? "image/jpeg" : "image/png";
  return new Response(body, { headers: { "content-type": type } });
}
