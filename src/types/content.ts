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

export interface SiteContent {
  bio: string;
  categories: Record<CategorySlug, { projects: Project[] }>;
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

export const ARCHITECTURE_COLUMNS = 3;

export const DEFAULT_CONTENT: SiteContent = {
  bio: "Welcome. Add a short introduction about yourself here.",
  categories: {
    architecture: { projects: [] },
    art: { projects: [] },
    photography: { projects: [] },
    leather: { projects: [] },
  },
};
