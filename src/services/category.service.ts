import { type Category, type CategorySlug } from "generated/prisma";

import { prisma } from "@/db/prisma";

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function getCategoryBySlug(slug: CategorySlug): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    throw new Error(`Category with slug "${slug}" not found`);
  }

  return category;
}
