import { Product, ProductCategory } from "@/models/product.model";

import { products } from "../fixtures/products.fixture";

export function getProductsByCategory(
  category: ProductCategory
): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = products.filter(
        (product) => product.category === category
      );
      resolve(filteredProducts);
    }, 500);
  });
}

export function getProductById(id: string): Promise<Product | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = products.find((product) => product.id === id);
      resolve(product || null);
    }, 500);
  });
}
