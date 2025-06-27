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
  });

  return products.map((product) => ({
    ...product,
    price: product.price.toNumber(),
  }));
}

export async function getProductById(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return { ...product, price: product.price.toNumber() };
}

export async function getAllProducts(): Promise<Product[]> {
  // No la utilizamos en repository.
  return (await prisma.product.findMany()).map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));
}
