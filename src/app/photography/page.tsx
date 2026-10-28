import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

// Render on every request so edits show up right away.
export const dynamic = "force-dynamic";

export default async function PhotographyPage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="photography"
      initialProjects={content.categories.photography.projects}
    />
  );
}
