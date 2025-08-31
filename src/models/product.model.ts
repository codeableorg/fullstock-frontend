import type {
  Product as PrismaProduct,
  ProductVariant as PrismaProductVariant,
} from "@/../generated/prisma/client";

export type ProductVariant = Omit<PrismaProductVariant, "price"> & {
  price: number;
};

export type Product = Omit<PrismaProduct, "price"> & {
  price: number;
  variants?: ProductVariant[];
};
