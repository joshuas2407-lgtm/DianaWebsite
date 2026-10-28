// One-time copy of local content into Vercel Blob, so the deployed site starts
// with everything edited locally.
//
// 1. Put BLOB_READ_WRITE_TOKEN in .env.local (run `npx vercel env pull .env.local`
//    after connecting a Blob store, or copy it from the Vercel dashboard).
// 2. npm run upload-to-blob
//
// Uploads every /uploads/... image referenced in data/content.json, points the
// content at the new Blob URLs, and saves the result as content.json in Blob.
// Running it again overwrites the live content with your local copy.

import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN is not set in .env.local.");
  process.exit(1);
}

const root = process.cwd();
const content = JSON.parse(
  await fs.readFile(path.join(root, "data", "content.json"), "utf-8")
);

const uploaded = new Map();

async function toBlobUrl(src) {
  if (!src.startsWith("/uploads/")) return src;
  if (uploaded.has(src)) return uploaded.get(src);

  const file = path.join(root, "public", src);
  let data;
  try {
    data = await fs.readFile(file);
  } catch {
    console.warn(`  missing on disk, left as-is: ${src}`);
    return src;
  }
  const blob = await put(`uploads/${path.basename(src)}`, data, {
    access: "public",
    addRandomSuffix: true,
  });
  console.log(`  ${src} -> ${blob.url}`);
  uploaded.set(src, blob.url);
  return blob.url;
}

for (const [name, category] of Object.entries(content.categories ?? {})) {
  console.log(`${name}:`);
  for (const project of category.projects ?? []) {
    project.images = await Promise.all((project.images ?? []).map(toBlobUrl));
  }
}

await put("content.json", JSON.stringify(content, null, 2), {
  access: "public",
  contentType: "application/json",
  addRandomSuffix: false,
  allowOverwrite: true,
  cacheControlMaxAge: 60,
});

console.log(`\nDone: ${uploaded.size} images uploaded and content.json saved to Blob.`);
