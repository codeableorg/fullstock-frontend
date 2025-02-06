import { categories } from "@/fixtures/categories.fixture";
import { Category } from "@/models/category.model";

export function getAllCategories(): Promise<Category[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(categories);
    }, 500);
  });
}

export function getCategoryBySlug(slug: string): Promise<Category | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const category = categories.find((cat) => cat.slug === slug);
      resolve(category || null);
    }, 500);
  });
}
