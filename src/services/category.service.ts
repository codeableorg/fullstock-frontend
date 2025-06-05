import { type Category } from "@/models/category.model";
import * as categoriesRepository from "@/repositories/category.repository";

export async function getAllCategories(): Promise<Category[]> {
  return categoriesRepository.getAllCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const category = await categoriesRepository.getCategoryBySlug(slug);

  if (!category) {
    throw new Error(`Category with slug "${slug}" not found`);
  }

  return category;
}
