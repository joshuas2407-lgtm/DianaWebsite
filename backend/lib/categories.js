export const CATEGORY_SLUGS = [
  "architecture",
  "art",
  "photography",
  "leather",
];

export function isValidCategory(category) {
  return CATEGORY_SLUGS.includes(category);
}
