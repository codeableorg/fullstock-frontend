export const VALID_SLUGS = ["polos", "stickers", "tazas"] as const;

export interface Category {
  id: number;
  title: string;
  slug: (typeof VALID_SLUGS)[number];
  imgSrc: string;
  alt?: string;
  description?: string;
}

export function isValidCategorySlug(
  categorySlug: unknown
): categorySlug is Category["slug"] {
  return (
    typeof categorySlug === "string" &&
    VALID_SLUGS.includes(categorySlug as Category["slug"])
  );
}
