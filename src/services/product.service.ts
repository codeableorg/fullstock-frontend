import { API_URL } from "@/config";
import { Category } from "@/models/category.model";
import { isApiError } from "@/models/error.model";
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
  try {
    const response = await fetch(`${API_URL}/products/${id}`);

    const data = await response.json();

    if (!response.ok) {
      if (isApiError(data)) throw new Error(data.error.message);
      throw new Error("Unknown error");
    }

    return data as Product;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
