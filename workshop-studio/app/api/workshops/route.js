import { NextResponse } from "next/server";
import { createWorkshop, listWorkshops } from "../../../lib/workshops";

export async function GET() {
  try {
    return NextResponse.json({ workshops: await listWorkshops() });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const input = await request.json();
    const created = await createWorkshop(input);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}
