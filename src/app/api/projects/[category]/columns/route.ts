import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import { addArtColumn, categoryResponse } from "@/lib/content";

type Params = { params: Promise<{ category: string }> };

export async function POST(_request: Request, { params }: Params) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { category } = await params;
  if (category !== "art") {
    return NextResponse.json(
      { error: "Only art supports expandable columns" },
      { status: 400 }
    );
  }
  return NextResponse.json(categoryResponse(await addArtColumn(), "art"));
}
