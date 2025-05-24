import { serverClient } from "@/lib/client.server";
import { type Category } from "@/models/category.model";
import { type Product } from "@/models/product.model";

export async function getProductsByCategorySlug(request: Request, categorySlug: Category["slug"]): Promise<Product[]> {
  const category = await serverClient<Category>(`/categories/${categorySlug}`, request);
  return serverClient<Product[]>(`/products?categoryId=${category.id}`, request);
}

export async function getProductById(request: Request, id: number): Promise<Product> {
  return serverClient<Product>(`/products/${id}`, request);
}
