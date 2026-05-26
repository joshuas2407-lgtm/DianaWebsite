import Link from "next/link";
import {
  BagIcon,
  CameraIcon,
  EaselIcon,
  HouseIcon,
} from "@/components/icons/CategoryIcons";
import type { CategorySlug } from "@/types/content";

const CATEGORIES: {
  slug: CategorySlug;
  label: string;
  Icon: typeof HouseIcon;
}[] = [
  { slug: "architecture", label: "Architecture", Icon: HouseIcon },
  { slug: "art", label: "Art", Icon: EaselIcon },
  { slug: "photography", label: "Photography", Icon: CameraIcon },
  { slug: "leather", label: "Leather", Icon: BagIcon },
];

export function CategoryHub() {
  return (
    <section className="snap-section hub" id="categories">
      <nav className="hub__grid" aria-label="Portfolio categories">
        {CATEGORIES.map(({ slug, label, Icon }) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="hub__card"
            aria-label={label}
          >
            <Icon className="hub__icon" />
            <span className="hub__label">{label}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
