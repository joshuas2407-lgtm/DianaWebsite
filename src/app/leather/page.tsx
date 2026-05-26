import { readContent } from "@/lib/content";
import { CategoryPageClient } from "@/components/cms/CategoryPage";

export default async function LeatherPage() {
  const content = await readContent();
  return (
    <CategoryPageClient
      category="leather"
      initialProjects={content.categories.leather.projects}
    />
  );
}
