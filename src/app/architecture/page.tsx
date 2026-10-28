import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

// Render on every request so edits show up right away.
export const dynamic = "force-dynamic";

export default async function ArchitecturePage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="architecture"
      initialProjects={content.categories.architecture.projects}
    />
  );
}
