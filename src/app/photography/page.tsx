import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

export default async function PhotographyPage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="photography"
      initialProjects={content.categories.photography.projects}
    />
  );
}
