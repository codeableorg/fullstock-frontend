import { prisma } from "@/db/prisma";

import {
  type Category,
  type CategorySlug,
  type Prisma,
} from "@/../generated/prisma/client";

type CategoryWithVariants = Prisma.CategoryGetPayload<{
  include: { categoryVariants: true };
}>;

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

export async function getCategoryWithVariants(
  categoryId: number
): Promise<CategoryWithVariants | null> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      categoryVariants: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return category;
}
