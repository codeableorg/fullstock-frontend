import { client } from "@/lib/utils";
import { Category } from "@/models/category.model";
import { Product } from "@/models/product.model";

export async function getProductsByCategorySlug(categorySlug: Category["slug"]): Promise<Product[]> {
  const category = await client<Category>(`/categories/${categorySlug}`);
  return client<Product[]>(`/products?categoryId=${category.id}`);
}

export async function getProductById(id: number): Promise<Product> {
  return client<Product>(`/products/${id}`);
}
