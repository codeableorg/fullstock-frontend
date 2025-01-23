import { Product, ProductCategory } from "./product.types";
import { mockProducts } from "./mockProducts";

export const ProductService = {
  getProductsByCategory(category: ProductCategory): Promise<Product[]> {
    // Simulate API call with 500ms delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = mockProducts.filter(
          (product) => product.category === category
        );
        resolve(products);
      }, 500);
    });
  },
};
