import { NextResponse } from "next/server";
import { readWorkshop, updateWorkshop } from "../../../../lib/workshops";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    return NextResponse.json(await readWorkshop(slug));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { slug } = await params;
    const { markdown } = await request.json();
    return NextResponse.json(await updateWorkshop(slug, markdown));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
