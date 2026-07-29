export type CategorySlug =
  | "architecture"
  | "art"
  | "photography"
  | "leather";

export interface Project {
  id: string;
  title: string;
  date: string;
  text: string;
  images: string[];
  column?: number;
}

export interface CategoryData {
  projects: Project[];
  columnCount?: number;
}

export interface SiteContent {
  bio: string;
  categories: Record<CategorySlug, CategoryData>;
}

export const CATEGORY_SLUGS: CategorySlug[] = [
  "architecture",
  "art",
  "photography",
  "leather",
];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  architecture: "Architecture",
  art: "Art",
  photography: "Photography",
  leather: "Leather",
};

export const CATEGORY_PAGE_TITLES: Record<CategorySlug, string> = {
  architecture: "Portfolio",
  art: "Art",
  photography: "Photography",
  leather: "Leather",
};

export const FIXED_COLUMN_COUNT = 3;

export const FIXED_COLUMN_CATEGORIES: CategorySlug[] = [
  "architecture",
  "photography",
];

export const EXPANDABLE_COLUMN_CATEGORIES: CategorySlug[] = ["art"];

export const ART_DEFAULT_COLUMN_COUNT = 1;

export function resolveColumnCount(
  category: CategorySlug,
  projects: Project[],
  storedCount?: number
): number {
  if (EXPANDABLE_COLUMN_CATEGORIES.includes(category)) {
    const fromProjects = projects.reduce(
      (max, project) => Math.max(max, (project.column ?? 0) + 1),
      0
    );
    return Math.max(
      storedCount ?? ART_DEFAULT_COLUMN_COUNT,
      fromProjects,
      ART_DEFAULT_COLUMN_COUNT
    );
  }

  if (FIXED_COLUMN_CATEGORIES.includes(category)) {
    return FIXED_COLUMN_COUNT;
  }

  return 0;
}

export function usesColumnLayout(category: CategorySlug): boolean {
  return (
    FIXED_COLUMN_CATEGORIES.includes(category) ||
    EXPANDABLE_COLUMN_CATEGORIES.includes(category)
  );
}

export const DEFAULT_CONTENT: SiteContent = {
  bio: "Welcome. Add a short introduction about yourself here.",
  categories: {
    architecture: { projects: [] },
    art: { projects: [] },
    photography: { projects: [] },
    leather: { projects: [] },
  },
};
