import { prisma } from "@/db/prisma";

import { type Category, type CategorySlug } from "@/../generated/prisma/client";

export type CategoryWithVariantsInfo = {
  id: number;
  title: string;
  slug: CategorySlug;
  hasVariants: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryVariants: {
    id: number;
    value: string;
    label: string;
    priceModifier: number;
    sortOrder: number;
  }[];
};

export type CategoryWithVariantsTransformed = {
  id: number;
  title: string;
  slug: CategorySlug;
  hasVariants: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryVariants: {
    id: number;
    value: string;
    label: string;
    priceModifier: number; // ← Convertido a number
    categoryId: number;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany();
  return categories;
}

export async function getAllCategoriesWithVariants(): Promise<
  CategoryWithVariantsInfo[]
> {
  const categories = await prisma.category.findMany({
    include: {
      categoryVariants: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return categories.map((category) => ({
    ...category,
    categoryVariants: category.categoryVariants.map((variant) => ({
      id: variant.id,
      value: variant.value,
      label: variant.label,
      priceModifier: Number(variant.priceModifier),
      sortOrder: variant.sortOrder,
    })),
  }));
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
): Promise<CategoryWithVariantsTransformed | null> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      categoryVariants: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!category) {
    return null;
  }
  return {
    ...category,
    categoryVariants: category.categoryVariants.map((variant) => ({
      ...variant,
      priceModifier: Number(variant.priceModifier),
    })),
  };
}
