import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestCategory, createTestProduct } from "@/lib/utils.tests";
import type { Category } from "@/models/category.model";
import type { Product } from "@/models/product.model";
import * as productRepository from "@/repositories/product.repository";

import { getCategoryBySlug } from "./category.service";
import { getProductById, getProductsByCategorySlug } from "./product.service";

// Mock dependencies
vi.mock("@/repositories/product.repository");
vi.mock("./category.service");

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsByCategorySlug", () => {
    it("should return products for a valid category slug", async () => {
      // Step 1: Setup - Create test data with valid category and products
      const testCategory = createTestCategory();
      const mockedProducts: Product[] = [
        createTestProduct({ id: 1, categoryId: testCategory.id }),
        createTestProduct({
          id: 2,
          title: "Test Product 2",
          categoryId: testCategory.id,
        }),
      ];

      // Step 2: Mock - Configure repository responses
      vi.mocked(getCategoryBySlug).mockResolvedValue(testCategory);
      vi.mocked(productRepository.getProductsByCategory).mockResolvedValue(
        mockedProducts
      );

      // Step 3: Call service function
      const products = await getProductsByCategorySlug(testCategory.slug);

      // Step 4: Verify expected behavior
      expect(getCategoryBySlug).toHaveBeenCalledWith(testCategory.slug);
      expect(productRepository.getProductsByCategory).toHaveBeenCalledWith(
        testCategory.id
      );
      expect(products).toEqual(mockedProducts);
    });

    it("should throw error when category slug does not exist", async () => {
      // Step 1: Setup - Create test data for non-existent category
      const invalidSlug = "invalid-slug";

      // Step 2: Mock - Configure error response
      const errorMessage = `Category with slug "${invalidSlug}" not found`;
      vi.mocked(getCategoryBySlug).mockRejectedValue(new Error(errorMessage));

      // Step 3: Call service function
      const getProducts = getProductsByCategorySlug(
        invalidSlug as Category["slug"]
      );

      // Step 4: Verify expected behavior
      await expect(getProducts).rejects.toThrow(errorMessage);
      expect(productRepository.getProductsByCategory).not.toHaveBeenCalled();
    });
  });

  describe("getProductById", () => {
    it("should return product for valid ID", async () => {
      // Step 1: Setup - Create test data for existing product
      const testProduct = createTestProduct();

      // Step 2: Mock - Configure repository response
      vi.mocked(productRepository.getProductById).mockResolvedValue(
        testProduct
      );

      // Step 3: Call service function
      const result = await getProductById(testProduct.id);

      // Step 4: Verify expected behavior
      expect(productRepository.getProductById).toHaveBeenCalledWith(
        testProduct.id
      );
      expect(result).toEqual(testProduct);
    });

    it("should throw error when product does not exist", async () => {
      // Step 1: Setup - Configure ID for non-existent product
      const nonExistentId = 999;

      // Step 2: Mock - Configure null response from repository
      vi.mocked(productRepository.getProductById).mockResolvedValue(null);

      // Step 3: Call service function
      const productPromise = getProductById(nonExistentId);

      // Step 4: Verify expected behavior
      await expect(productPromise).rejects.toThrow("Product not found");
    });
  });
});
