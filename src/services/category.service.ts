import { client } from "@/lib/utils";
import { Category } from "@/models/category.model";

export async function getAllCategories(): Promise<Category[]> {
  return client<Category[]>("/categories");
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return client<Category>(`/categories/${slug}`);
}
