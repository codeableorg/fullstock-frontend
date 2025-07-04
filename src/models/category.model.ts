import type { Category as PrismaCategory } from "@/../generated/prisma/client";

export const VALID_SLUGS = ["polos", "stickers", "tazas"] as const;

export type Category = PrismaCategory;

export function isValidCategorySlug(
  categorySlug: unknown
): categorySlug is Category["slug"] {
  return (
    typeof categorySlug === "string" &&
    VALID_SLUGS.includes(categorySlug as Category["slug"])
  );
}
