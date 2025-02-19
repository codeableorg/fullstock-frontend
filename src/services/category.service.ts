import { API_URL } from "@/config";
import { Category } from "@/models/category.model";
import { ApiErrorResponse } from "@/models/error.model";

export async function getAllCategories(): Promise<Category[]> {
  const response = await fetch(API_URL + "/categories");

  let data;

  try {
    data = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Error parsing JSON response");
  }

  if (!response.ok) {
    const errorMessage =
      (data as ApiErrorResponse)?.error?.message || "Unknown error";
    const error = new Error(errorMessage);
    console.error(error);
    throw error;
  }

  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const response = await fetch(API_URL + "/categories/" + slug);

  let data;

  try {
    data = await response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Error parsing JSON response");
    }

    if (!response.ok) {
      const errorMessage =
        (data as ApiErrorResponse)?.error?.message || "Unknown error";
      const error = new Error(errorMessage);
      console.error(error);
      throw error;
    }
  
    return data as Category;

}
