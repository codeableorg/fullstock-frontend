import { serverClient } from "@/lib/client.server";
import { client } from "@/lib/utils";
import { type Category } from "@/models/category.model";
import { type Product } from "@/models/product.model";

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"],
  request: Request
): Promise<Product[]> {
  const category = await serverClient<Category>(
    `/categories/${categorySlug}`,
    request
  );
  return serverClient<Product[]>(
    `/products?categoryId=${category.id}`,
    request
  );
}

export async function getProductById(
  id: number,
  request: Request
): Promise<Product> {
  return serverClient<Product>(`/products/${id}`, request);
}
