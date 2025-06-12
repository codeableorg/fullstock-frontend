import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Category } from "@/models/category.model";
import type { Product } from "@/models/product.model";
import * as productRepository from "@/repositories/product.repository";

import { getCategoryBySlug } from "./category.service";
import { getProductById, getProductsByCategorySlug } from "./product.service";

// Mock dependencies
vi.mock("@/repositories/product.repository");
vi.mock("./category.service");

// Test data setup
const mockCategory: Partial<Category> = {
  id: 1,
  slug: "polos",
};

const mockProduct: Partial<Product> = {
  id: 1,
  title: "Test Product",
  price: 100,
  categoryId: mockCategory.id,
  description: "Test description",
};

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsByCategorySlug", () => {
    it("should return products for a valid category slug", async () => {
      // Step 1: Setup - Create test data with valid category and products
      const mockedProducts = [
        { ...mockProduct, id: 1 },
        { ...mockProduct, id: 2, title: "Test Product 2" },
      ];

      // Step 2: Mock - Configure repository responses
      vi.mocked(getCategoryBySlug).mockResolvedValue(mockCategory as Category);
      vi.mocked(productRepository.getProductsByCategory).mockResolvedValue(
        mockedProducts as Product[]
      );

      // Step 3: Call service function
      const products = await getProductsByCategorySlug(mockCategory.slug!);

      // Step 4: Verify expected behavior
      expect(getCategoryBySlug).toHaveBeenCalledWith(mockCategory.slug);
      expect(productRepository.getProductsByCategory).toHaveBeenCalledWith(
        mockCategory.id
      );
      expect(products).toEqual(mockedProducts);
    });

    it("should throw error when category slug does not exist", async () => {
      // Step 1: Setup - Create test data for non-existent category
      const invalidSlug = "invalid-slug";

      // Step 2: Mock - Configure error response
      vi.mocked(getCategoryBySlug).mockRejectedValue(
        new Error(`Category with slug "${invalidSlug}" not found`)
      );

      // Step 3: Call service function
      const getProducts = getProductsByCategorySlug(
        invalidSlug as Category["slug"]
      );

      // Step 4: Verify expected behavior
      await expect(getProducts).rejects.toThrow(
        `Category with slug "${invalidSlug}" not found`
      );
      expect(productRepository.getProductsByCategory).not.toHaveBeenCalled();
    });
  });

  describe("getProductById", () => {
    it("should return product for valid ID", async () => {
      // Step 1: Setup - Create test data for existing product
      const productId = mockProduct.id!;

      // Step 2: Mock - Configure repository response
      vi.mocked(productRepository.getProductById).mockResolvedValue(
        mockProduct as Product
      );

      // Step 3: Call service function
      const result = await getProductById(productId);

      // Step 4: Verify expected behavior
      expect(productRepository.getProductById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it("should throw error when product does not exist", async () => {
      // Step 1: Setup - Configure ID for non-existent product
      const nonExistentId = 999;

      // Step 2: Mock - Configure null response from repository
      vi.mocked(productRepository.getProductById).mockResolvedValue(null);

      // Step 3: Call service function
      const getProduct = getProductById(nonExistentId);

      // Step 4: Verify expected behavior
      await expect(getProduct).rejects.toThrow("Product not found");
    });
  });
});
