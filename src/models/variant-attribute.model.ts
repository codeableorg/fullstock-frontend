import type { VariantAttributeValue as PrismaVariantAttributeValue, VariantAttribute } from "@/../generated/prisma/client";

export type VariantAttributeValue = PrismaVariantAttributeValue & {
  variantAttribute?: VariantAttribute;
};