import { describe, it, vi, beforeEach, expect } from "vitest";

import type { Category } from "@/models/category.model";
import type { Product } from "@/models/product.model";
import * as productRepository from "@/repositories/product.repository";

import { getCategoryBySlug } from "./category.service";
import { getProductsByCategorySlug } from "./product.service";

// Mock dependencies
vi.mock("@/repositories/product.repository");
vi.mock("./category.service");

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsByCategorySlug", () => {
    it("should return products for a valid category slug", async () => {
      // 1. Mock getCategoryBySlug to return a valid category with id
      const mockCategory = {
        id: 1,
        slug: "polos",
      } as Category;

      vi.mocked(getCategoryBySlug).mockResolvedValue(mockCategory);

      // 2. Mock productRepository.getProductsByCategory to return array of products
      const mockedProducts = [
        { id: 1, title: "Product 1", price: 10, categoryId: 1 } as Product,
        { id: 2, title: "Product 2", price: 20, categoryId: 1 } as Product,
      ];

      vi.mocked(productRepository.getProductsByCategory).mockResolvedValue(
        mockedProducts
      );

      // 3. Call getProductsByCategorySlug with valid slug (e.g., "polos")
      const products = await getProductsByCategorySlug(mockCategory.slug);
      // 4. Assert that getCategoryBySlug was called with correct slug
      expect(getCategoryBySlug).toHaveBeenCalledWith(mockCategory.slug);
      // 5. Assert that getProductsByCategory was called with category.id
      expect(productRepository.getProductsByCategory).toHaveBeenCalledWith(
        mockCategory.id
      );
      // 6. Assert that returned products match the mocked products array
      expect(products).toEqual(mockedProducts);
    });

    it("should throw error when category slug does not exist", async () => {
      // 1. Mock getCategoryBySlug to throw "Category not found" error
      // 2. Call getProductsByCategorySlug with invalid slug
      // 3. Assert that the function throws the expected error
      // 4. Assert that getProductsByCategory was NOT called
    });

    it("should handle repository errors gracefully", async () => {
      // 1. Mock getCategoryBySlug to return valid category
      // 2. Mock productRepository.getProductsByCategory to throw database error
      // 3. Call getProductsByCategorySlug with valid slug
      // 4. Assert that the function throws/propagates the repository error
    });
  });

  describe("getProductById", () => {
    it("should return product for valid existing ID", async () => {
      // 1. Mock productRepository.getProductById to return a product object
      // 2. Call getProductById with valid ID (e.g., 1)
      // 3. Assert that getProductById was called with correct ID
      // 4. Assert that returned product matches the mocked product
    });

    it("should throw error when product ID does not exist", async () => {
      // 1. Mock productRepository.getProductById to return null
      // 2. Call getProductById with non-existent ID
      // 3. Assert that function throws "Product not found" error
    });

    it("should handle repository errors gracefully", async () => {
      // 1. Mock productRepository.getProductById to throw database error
      // 2. Call getProductById with any ID
      // 3. Assert that the function throws/propagates the repository error
    });
  });
});
