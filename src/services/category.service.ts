import { serverClient } from "@/lib/client.server";
import { type Category } from "@/models/category.model";

export async function getAllCategories(request: Request): Promise<Category[]> {
  return serverClient<Category[]>("/categories", request);
}

export async function getCategoryBySlug(slug: string, request: Request): Promise<Category> {
  return serverClient<Category>(`/categories/${slug}`, request);
}
