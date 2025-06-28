import type { Product as PrismaProduct } from "generated/prisma/client";

export type Product = Omit<PrismaProduct, "price"> & {
  price: number;
};
