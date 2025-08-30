import type { Product as PrismaProduct } from "@/../generated/prisma/client";

export type Product = Omit<PrismaProduct, "price"> & {
  price: number;
  variants?: ProductVariant[];
  stickersVariants?: StickersVariant[];
};

export type StickersVariant = {
  id: number;
  measure: "3*3" | "5*5" | "10*10";
  price: number;
};
export interface ProductVariant {
  id: number;
  size: "small" | "medium" | "large";
}
