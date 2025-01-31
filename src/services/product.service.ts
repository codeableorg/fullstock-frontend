import { Product, ProductCategory } from "@/models/product";
import { mockProducts } from "./products.mock";

export function getProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = mockProducts.filter(
        (product) => product.category === category
      );
      resolve(products);
    }, 500);
  });
}

export function getProductById(id: string): Promise<Product | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((product) => product.id === id);
      resolve(product || null);
    }, 500);
  });
}
