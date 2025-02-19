import { Category } from "@/models/category.model";
import { Product } from "@/models/product.model";

import { products } from "../fixtures/products.fixture";

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  try {
    const response = await fetch(`/api/products?category=${categorySlug}`);
    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }
    const products: Product[] = await response.json();
    return products;
  } catch (error) {
      console.error("Error al obtener productos", error);
      throw error;
  }
}

export function getProductById(id: string): Promise<Product | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find((product) => product.id === id);
      resolve(product || null);
    }, 500);
  });
}
