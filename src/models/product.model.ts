import type { VariantAttributeValue } from "./variant-attribute.model";
import type { Product as PrismaProduct } from "@/../generated/prisma/client";

export type Product = PrismaProduct & {
  price?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
};

export type ProductVariantValue = PrismaProduct & {
  variantAttributeValues: VariantAttributeValue[];
}