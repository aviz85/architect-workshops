import { NextResponse } from "next/server";
import { buildMaterials } from "../../../lib/workshops";

export async function POST(request) {
  try {
    const input = await request.json();
    return NextResponse.json({ materials: buildMaterials(input) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
