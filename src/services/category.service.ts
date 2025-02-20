import { API_URL } from "@/config";
import { Category } from "@/models/category.model";
import { isApiError } from "@/models/error.model";

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetch(API_URL + "/categories");

    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Category[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const response = await fetch(API_URL + "/categories/" + slug);

    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Category;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
