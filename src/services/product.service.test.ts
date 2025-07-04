import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma as mockPrisma } from "@/db/prisma";
import { createTestCategory, createTestDBProduct } from "@/lib/utils.tests";
import type { Category } from "@/models/category.model";

import { getCategoryBySlug } from "./category.service";
import { getProductById, getProductsByCategorySlug } from "./product.service";

import type { Product as PrismaProduct } from "@/../generated/prisma/client";

vi.mock("@/db/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Mock category service
vi.mock("./category.service");

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsByCategorySlug", () => {
    it("should return products for a valid category slug", async () => {
      // Step 1: Setup - Create test data with valid category and products
      const testCategory = createTestCategory();
      const mockedProducts: PrismaProduct[] = [
        createTestDBProduct({ id: 1, categoryId: testCategory.id }),
        createTestDBProduct({
          id: 2,
          title: "Test Product 2",
          categoryId: testCategory.id,
        }),
      ];

      // Step 2: Mock - Configure responses
      vi.mocked(getCategoryBySlug).mockResolvedValue(testCategory);

      vi.mocked(mockPrisma.product.findMany).mockResolvedValue(mockedProducts);

      // Step 3: Call service function
      const products = await getProductsByCategorySlug(testCategory.slug);

      // Step 4: Verify expected behavior
      expect(getCategoryBySlug).toHaveBeenCalledWith(testCategory.slug);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: testCategory.id },
      });
      expect(products).toEqual(
        mockedProducts.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        }))
      );
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
      expect(mockPrisma.product.findMany).not.toHaveBeenCalled();
    });
  });

  describe("getProductById", () => {
    it("should return product for valid ID", async () => {
      // Step 1: Setup - Create test data for existing product
      const testProduct = createTestDBProduct();

      // Step 2: Mock - Configure Prisma response
      vi.mocked(mockPrisma.product.findUnique).mockResolvedValue(testProduct);

      // Step 3: Call service function
      const result = await getProductById(testProduct.id);

      // Step 4: Verify expected behavior
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: testProduct.id },
      });
      expect(result).toEqual({
        ...testProduct,
        price: testProduct.price.toNumber(),
      });
    });

    it("should throw error when product does not exist", async () => {
      // Step 1: Setup - Configure ID for non-existent product
      const nonExistentId = 999;

      // Step 2: Mock - Configure null response from Prisma
      vi.mocked(mockPrisma.product.findUnique).mockResolvedValue(null);

      // Step 3: Call service function
      const productPromise = getProductById(nonExistentId);

      // Step 4: Verify expected behavior
      await expect(productPromise).rejects.toThrow("Product not found");
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: nonExistentId },
      });
    });
  });
});
