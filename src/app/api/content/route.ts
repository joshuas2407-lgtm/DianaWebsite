import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import { readContent, updateBio } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readContent());
}

export async function PATCH(request: Request) {
  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    bio?: unknown;
  } | null;
  if (typeof body?.bio !== "string") {
    return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
  }
  return NextResponse.json(await updateBio(body.bio));
}
