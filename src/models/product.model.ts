// import { type Category } from "./category.model";

import type { Product as PrismaProduct } from "generated/prisma/client";

// export interface Product {
//   id: number;
//   title: string;
//   imgSrc: string;
//   alt: string | null;
//   price: number;
//   description: string | null;
//   categoryId: number;
//   // categorySlug: Category["slug"];
//   isOnSale: boolean;
//   features: string[];
//   createdAt: string;
//   updatedAt: string;
// }

export type Product = Omit<PrismaProduct, "price"> & {
  price: number;
};
