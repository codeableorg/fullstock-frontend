import { API_URL } from "@/config";
import { categories } from "@/fixtures/categories.fixture";
import { Category } from "@/models/category.model";

export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(API_URL + "/categories");
  const data = await response.json();
  return data;
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const category = categories.find((cat) => cat.slug === slug);
      resolve(category || null);
    }, 500);
  });
}
