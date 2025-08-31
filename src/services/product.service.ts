import { prisma } from "@/db/prisma";
import type { Category } from "@/models/category.model";
import type { Product } from "@/models/product.model";

import { getCategoryBySlug } from "./category.service";

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { variants: true },
  });

  return products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
    variants: p.variants.map((v) => ({
      ...v,
      price: v.price.toNumber(),
    })),
  }));
}

export async function getProductById(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return {
    ...product,
    price: product.price.toNumber(),
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price.toNumber(),
    })),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: { variants: true },
  });

  return products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
    variants: p.variants.map((v) => ({
      ...v,
      price: v.price.toNumber(),
    })),
  }));
}
