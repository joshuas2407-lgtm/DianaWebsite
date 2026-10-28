import { NextResponse } from "next/server";
import { startOwnerSession, verifyOwnerPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    password?: unknown;
  } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!password || !verifyOwnerPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await startOwnerSession();
  return NextResponse.json({ ok: true });
}
