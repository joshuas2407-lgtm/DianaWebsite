import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

/**
 * Where site content and images are saved.
 *
 * - "blob": Vercel Blob storage. Used whenever BLOB_READ_WRITE_TOKEN is set,
 *   which Vercel does automatically once a Blob store is connected to the
 *   project. Needed for editing on the deployed site, where the filesystem
 *   is read-only.
 * - "local": data/content.json and public/uploads/ on disk. Used for local
 *   development when no Blob token is set.
 */
export type StorageMode = "blob" | "local";

export function storageMode(): StorageMode {
  return process.env.BLOB_READ_WRITE_TOKEN ? "blob" : "local";
}

const CONTENT_BLOB_PATH = "content.json";
const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/** Returns the saved content JSON, or null if nothing has been saved yet. */
export async function readContentRaw(): Promise<unknown | null> {
  if (storageMode() === "blob") {
    // useCache: false reads straight from storage, so edits show up at once.
    const result = await get(CONTENT_BLOB_PATH, {
      access: "public",
      useCache: false,
    });
    if (result && result.statusCode === 200) {
      return JSON.parse(await new Response(result.stream).text());
    }
    // Nothing saved to Blob yet: fall back to the file bundled with the deploy.
  }

  try {
    return JSON.parse(await fs.readFile(CONTENT_PATH, "utf-8"));
  } catch {
    return null;
  }
}

export async function writeContentRaw(content: unknown): Promise<void> {
  const json = JSON.stringify(content, null, 2);
  if (storageMode() === "blob") {
    await put(CONTENT_BLOB_PATH, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
    return;
  }
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_PATH, json, "utf-8");
}

/** Saves an uploaded image to public/uploads (local mode only). */
export async function saveLocalImage(file: File): Promise<string> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  await fs.writeFile(
    path.join(UPLOAD_DIR, filename),
    Buffer.from(await file.arrayBuffer())
  );
  return `/uploads/${filename}`;
}
