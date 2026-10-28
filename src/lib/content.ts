import "server-only";
import {
  CATEGORY_SLUGS,
  DEFAULT_CONTENT,
  type CategorySlug,
  type Project,
  type SiteContent,
} from "@/types/content";
import { readContentRaw, writeContentRaw } from "@/lib/storage";

export function isValidCategory(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as string[]).includes(value);
}

export async function readContent(): Promise<SiteContent> {
  const parsed = ((await readContentRaw()) ?? {}) as Partial<SiteContent>;
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
  await writeContentRaw(content);
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
  content.categories[category].projects.push({
    ...project,
    id: crypto.randomUUID(),
  });
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

function artColumnCount(content: SiteContent): number {
  const art = content.categories.art;
  const fromProjects = art.projects.reduce(
    (max, project) => Math.max(max, (project.column ?? 0) + 1),
    0
  );
  return Math.max(art.columnCount ?? 1, fromProjects, 1);
}

export async function addArtColumn(): Promise<SiteContent> {
  const content = await readContent();
  content.categories.art.columnCount = artColumnCount(content) + 1;
  await writeContent(content);
  return content;
}

/** The response shape the category pages expect from /api/projects. */
export function categoryResponse(content: SiteContent, category: CategorySlug) {
  return {
    projects: content.categories[category].projects,
    columnCount: category === "art" ? artColumnCount(content) : undefined,
  };
}
