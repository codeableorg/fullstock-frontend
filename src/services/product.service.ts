import { type Category } from "@/models/category.model";
import { type Product } from "@/models/product.model";
import * as productRepository from "@/repositories/product.repository";

import { getCategoryBySlug } from "./category.service";

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  const products = await productRepository.getProductsByCategory(
    Number(category.id)
  );

  return products;
}

export async function getProductById(id: number): Promise<Product> {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}
