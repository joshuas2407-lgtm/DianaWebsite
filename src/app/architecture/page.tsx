import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

export default async function ArchitecturePage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="architecture"
      initialProjects={content.categories.architecture.projects}
    />
  );
}
