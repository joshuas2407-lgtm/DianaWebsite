import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DATA_DIR = path.join(ROOT, "data");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");

export const DEFAULT_CONTENT = {
  bio: "Welcome. Add a short introduction about yourself here.",
  categories: {
    architecture: { projects: [] },
    art: { projects: [] },
    photography: { projects: [] },
    leather: { projects: [] },
  },
};

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(CONTENT_PATH);
  } catch {
    await fs.writeFile(
      CONTENT_PATH,
      JSON.stringify(DEFAULT_CONTENT, null, 2),
      "utf-8"
    );
  }
}

export async function readContent() {
  await ensureDataFile();
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return {
    ...DEFAULT_CONTENT,
    ...parsed,
    categories: {
      ...DEFAULT_CONTENT.categories,
      ...parsed.categories,
    },
  };
}

export async function writeContent(content) {
  await ensureDataFile();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export async function updateBio(bio) {
  const content = await readContent();
  content.bio = bio;
  await writeContent(content);
  return content;
}

export async function addProject(category, project) {
  const content = await readContent();
  const newProject = {
    ...project,
    id: crypto.randomUUID(),
  };
  content.categories[category].projects.push(newProject);
  await writeContent(content);
  return content;
}

export async function updateProject(category, projectId, updates) {
  const content = await readContent();
  const projects = content.categories[category].projects;
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) {
    throw new Error("Project not found");
  }
  projects[index] = { ...projects[index], ...updates };
  await writeContent(content);
  return content;
}

export async function deleteProject(category, projectId) {
  const content = await readContent();
  content.categories[category].projects = content.categories[
    category
  ].projects.filter((p) => p.id !== projectId);
  await writeContent(content);
  return content;
}
