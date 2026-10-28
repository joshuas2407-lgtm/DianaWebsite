import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isOwner } from "@/lib/auth";
import { saveLocalImage, storageMode } from "@/lib/storage";

const MAX_IMAGE_BYTES = 50 * 1024 * 1024;

/**
 * Blob mode: the browser uploads images straight to Vercel Blob (which avoids
 * Vercel's 4.5 MB request limit). This route only hands out a short-lived
 * upload token, and only to the signed-in owner.
 *
 * Local mode: the browser posts the file here and it is saved to public/uploads.
 */
export async function POST(request: Request) {
  if (storageMode() === "blob") {
    const body = (await request.json()) as HandleUploadBody;
    try {
      const result = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => {
          if (!(await isOwner())) throw new Error("Unauthorized");
          return {
            allowedContentTypes: ["image/*"],
            maximumSizeInBytes: MAX_IMAGE_BYTES,
            addRandomSuffix: true,
          };
        },
      });
      return NextResponse.json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      const status = message === "Unauthorized" ? 401 : 400;
      return NextResponse.json({ error: message }, { status });
    }
  }

  if (!(await isOwner())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }
  return NextResponse.json({ url: await saveLocalImage(file) });
}
