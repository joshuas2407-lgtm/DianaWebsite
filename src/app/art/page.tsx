import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";
import { resolveColumnCount } from "@/types/content";

export default async function ArtPage() {
  const content = await readContent();
  const art = content.categories.art;
  return (
    <CategoryPageClient
      category="art"
      initialProjects={art.projects}
      initialColumnCount={resolveColumnCount(
        "art",
        art.projects,
        art.columnCount
      )}
    />
  );
}
