import { API_URL } from "@/config";
import { Category } from "@/models/category.model";
import { ApiErrorResponse } from "@/models/error.model";
import { Product } from "@/models/product.model";

import { products } from "../fixtures/products.fixture";

export function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = products.filter(
        (product) => product.categorySlug === categorySlug
      );
      resolve(filteredProducts);
    }, 500);
  });
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

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

  return data as Product;
}
