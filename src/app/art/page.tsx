import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

export default async function ArtPage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="art"
      initialProjects={content.categories.art.projects}
    />
  );
}
