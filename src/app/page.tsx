import { readContent } from "@/lib/content";
import { LandingSection } from "@/components/home/LandingSection";
import { CategoryHub } from "@/components/home/CategoryHub";

// Render on every request so edits show up right away.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await readContent();

  return (
    <div className="page-home home-scroll">
      <LandingSection bio={content.bio} />
      <CategoryHub />
    </div>
  );
}
