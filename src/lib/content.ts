import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_CONTENT,
  type CategorySlug,
  type Project,
  type SiteContent,
} from "@/types/content";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_PATH = path.join(DATA_DIR, "content.json");

async function ensureDataFile(): Promise<void> {
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

export async function readContent(): Promise<SiteContent> {
  await ensureDataFile();
  const raw = await fs.readFile(CONTENT_PATH, "utf-8");
  const parsed = JSON.parse(raw) as SiteContent;
  return {
    ...DEFAULT_CONTENT,
    ...parsed,
    categories: {
      ...DEFAULT_CONTENT.categories,
      ...parsed.categories,
    },
  };
}

export async function writeContent(content: SiteContent): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

export async function updateBio(bio: string): Promise<SiteContent> {
  const content = await readContent();
  content.bio = bio;
  await writeContent(content);
  return content;
}

export async function addProject(
  category: CategorySlug,
  project: Omit<Project, "id">
): Promise<SiteContent> {
  const content = await readContent();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
  };
  content.categories[category].projects.push(newProject);
  await writeContent(content);
  return content;
}

export async function updateProject(
  category: CategorySlug,
  projectId: string,
  updates: Partial<Omit<Project, "id">>
): Promise<SiteContent> {
  const content = await readContent();
  const projects = content.categories[category].projects;
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) throw new Error("Project not found");
  projects[index] = { ...projects[index], ...updates };
  await writeContent(content);
  return content;
}

export async function deleteProject(
  category: CategorySlug,
  projectId: string
): Promise<SiteContent> {
  const content = await readContent();
  content.categories[category].projects = content.categories[
    category
  ].projects.filter((p) => p.id !== projectId);
  await writeContent(content);
  return content;
}
