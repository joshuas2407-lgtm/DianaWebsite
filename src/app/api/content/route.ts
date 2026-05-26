import { NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import { readContent, updateBio } from "@/lib/content";

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function PATCH(request: Request) {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as { bio?: string };
  if (typeof body.bio !== "string") {
    return NextResponse.json({ error: "Invalid bio" }, { status: 400 });
  }
  const content = await updateBio(body.bio);
  return NextResponse.json(content);
}
