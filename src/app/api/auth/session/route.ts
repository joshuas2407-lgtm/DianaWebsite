import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import { storageMode } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    isOwner: await isOwner(),
    uploadMode: storageMode(),
  });
}
