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

export async function getProductById(id: number): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      stickersVariants: true,
      variants: true 
    }, // Incluye variantes
  });
  if (!product) return null;
  return {
    ...product,
    price: Number(product.price),
    variants: product.variants?.map(v => ({
      id: v.id,
      size: v.size as "small" | "medium" | "large",
    })),
    stickersVariants: product.stickersVariants?.map(s => ({
      id: s.id,
      measure: s.measure as "3*3" | "5*5" | "10*10",
      price: s.price.toNumber(),
    })),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  return (await prisma.product.findMany()).map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));
}
