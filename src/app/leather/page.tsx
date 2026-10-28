import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

// Render on every request so edits show up right away.
export const dynamic = "force-dynamic";

export default async function LeatherPage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="leather"
      initialProjects={content.categories.leather.projects}
    />
  );
}
