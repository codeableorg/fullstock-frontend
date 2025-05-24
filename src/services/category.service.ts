import { serverClient } from "@/lib/client.server";
import { type Category } from "@/models/category.model";
import * as categoriesRepository from "@/repositories/category.repository";

export async function getAllCategories(): Promise<Category[]> {
  return categoriesRepository.getAllCategories();
}

export async function getCategoryBySlug(
  slug: string,
  request: Request
): Promise<Category> {
  return serverClient<Category>(`/categories/${slug}`, request);
}
