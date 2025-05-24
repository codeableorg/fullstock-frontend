import * as db from "@/db";
import { type Category } from "@/models/category.model";

export async function getAllCategories(): Promise<Category[]> {
  return await db.query<Category>("SELECT * FROM categories");
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return await db.queryOne<Category>(
    "SELECT * FROM categories WHERE slug = $1",
    [slug]
  );
}
