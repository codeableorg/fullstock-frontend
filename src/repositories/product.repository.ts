import * as db from "@/db";
import { type Product } from "@/models/product.model";

export async function getAllProducts(): Promise<Product[]> {
  return await db.query<Product>("SELECT * FROM products");
}

export async function getProductById(id: number): Promise<Product | null> {
  const query = "SELECT * FROM products WHERE id = $1";
  return await db.queryOne<Product>(query, [id]);
}

export async function getProductsByCategory(
  categoryId: number
): Promise<Product[]> {
  const query = "SELECT * FROM products WHERE category_id = $1";
  return await db.query<Product>(query, [categoryId]);
}
