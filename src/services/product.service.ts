import { type Category, type Product } from "generated/prisma/client.js";

import { prisma } from "@/db/prisma";

import { getCategoryBySlug } from "./category.service";

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
  });

  return products;
}

export async function getProductById(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function getAllProducts(): Promise<Product[]> { // No la utilizamos en repository.
  return await prisma.product.findMany();
}
