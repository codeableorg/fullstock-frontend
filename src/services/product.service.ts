import { API_URL } from "@/config";
import { Category } from "@/models/category.model";
import { isApiError } from "@/models/error.model";
import { Product } from "@/models/product.model";

export async function getProductsByCategorySlug(categorySlug: Category["slug"]): Promise<Product[]> {
  try {
    const res_category = await fetch(`${API_URL}/categories/${categorySlug}`);
    const category = await res_category.json();

    if (!res_category.ok) {
      if (isApiError(category)) throw new Error(category.error.message);
      throw new Error("Unknown error");
    }

    const res_products = await fetch(`${API_URL}/products?categoryId=${category.id}`);
    const products = await res_products.json();

    if (!res_products.ok) {
      if (isApiError(products)) throw new Error(products.error.message);
      throw new Error("Unknown error");
    }

    return products as Product[];
  } catch (error) {
    console.error(error);
    throw error;
  }
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
