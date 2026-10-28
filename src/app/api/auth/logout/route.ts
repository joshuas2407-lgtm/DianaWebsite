import { NextResponse } from "next/server";
import { endOwnerSession } from "@/lib/auth";

export async function POST() {
  await endOwnerSession();
  return NextResponse.json({ ok: true });
}
