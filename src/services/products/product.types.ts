export const VALID_CATEGORIES = ["polos", "stickers", "tazas"] as const;
export type ProductCategory = (typeof VALID_CATEGORIES)[number];

export interface Product {
  id: string;
  title: string;
  imgSrc: string;
  price: number;
  description: string;
  category: ProductCategory;
  isOnSale: boolean;
  features: string[];
}

export function isValidCategory(
  category: unknown
): category is ProductCategory {
  return VALID_CATEGORIES.includes(category as ProductCategory);
}
