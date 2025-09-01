import { vi, describe, it, expect, beforeEach } from "vitest";


import { prisma as mockPrisma } from "@/db/prisma";
import {
  createTestCategory,
  createTestDBProduct,
  createTestDBVariantAttributeValue,
} from "@/lib/utils.tests";

import { getCategoryBySlug } from "./category.service";
import { getProductsByCategorySlug, getProductById } from "./product.service";

import type { Category } from "generated/prisma/client";

import { Decimal } from "@/../generated/prisma/internal/prismaNamespace";

vi.mock("@/db/prisma", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("./category.service");

describe("Product Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProductsByCategorySlug", () => {
    it("should return products for a valid category slug with prices as numbers", async () => {
      const testCategory = createTestCategory();

      const mockedProducts = [
        createTestDBProduct({ id: 1, categoryId: testCategory.id }),
        createTestDBProduct({ id: 2, categoryId: testCategory.id }),
      ];

      vi.mocked(getCategoryBySlug).mockResolvedValue(testCategory);
      vi.mocked(mockPrisma.product.findMany).mockResolvedValue(mockedProducts);

      const products = await getProductsByCategorySlug(testCategory.slug);

      expect(getCategoryBySlug).toHaveBeenCalledWith(testCategory.slug);
      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { categoryId: testCategory.id },
        include: { variantAttributeValues: true },
      });

      // Comprobamos que los precios se transforman a number
      expect(products).toEqual(
        mockedProducts.map((product) => ({
          ...product,
          price: product.variantAttributeValues[0].price.toNumber(),
        }))
      );
    });
    it("should throw error when category slug does not exist", async () => {
      const invalidSlug = "invalid-slug";
      const errorMessage = `Category with slug "${invalidSlug}" not found`;

      vi.mocked(getCategoryBySlug).mockRejectedValue(new Error(errorMessage));

      await expect(getProductsByCategorySlug(invalidSlug as Category["slug"])).rejects.toThrow(errorMessage);
      expect(mockPrisma.product.findMany).not.toHaveBeenCalled();
    });
  });

  describe("getProductById", () => {
    it("should return product for valid ID with prices as numbers", async () => {
      const testProduct = createTestDBProduct({
        id: 1,
        variantAttributeValues: [
          createTestDBVariantAttributeValue({ price: new Decimal(120) }),
          createTestDBVariantAttributeValue({ id: 2, price: new Decimal(150) }),
        ],
      });

      vi.mocked(mockPrisma.product.findUnique).mockResolvedValue(testProduct);

      const result = await getProductById(testProduct.id);

      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: testProduct.id },
        include: { variantAttributeValues: { include: { variantAttribute: true } } },
      });

      // Se espera que el producto devuelto tenga minPrice y maxPrice correctamente calculados
      expect(result).toEqual({
        ...testProduct,
        variantAttributeValues: testProduct.variantAttributeValues.map((v) => ({
          ...v,
          price: v.price.toNumber(),
        })),
      });
    });

    it("should throw error when product does not exist", async () => {
      const nonExistentId = 999;

      vi.mocked(mockPrisma.product.findUnique).mockResolvedValue(null);

      await expect(getProductById(nonExistentId)).rejects.toThrow("Product not found");
      expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: nonExistentId },
        include: { variantAttributeValues: { include: { variantAttribute: true } } },
      });
    });
  });
});
