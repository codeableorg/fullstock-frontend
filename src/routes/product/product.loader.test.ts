import { describe, expect, it, vi } from "vitest";

import { createTestProduct } from "@/lib/utils.tests";
import * as categoryService from "@/services/category.service";
import * as productService from "@/services/product.service";

import { loader } from ".";

import type { CategorySlug } from "generated/prisma/enums";

// Mock the product service
vi.mock("@/services/product.service", () => ({
  getProductById: vi.fn(), // mock function
}));

vi.mock("@/services/category.service", () => ({
  getCategoryWithVariants: vi.fn(),
}));

const mockGetProductById = vi.mocked(productService.getProductById);
const mockGetCategoryWithVariants = vi.mocked(
  categoryService.getCategoryWithVariants
);

describe("Product loader", () => {
  const createLoaderArgs = (id: string) => ({
    params: { id },
    request: new Request(`http://localhost/products/${id}`),
    context: {},
  });

  it("returns a product when it exists", async () => {
    const mockProduct = createTestProduct({ categoryId: 1 });

    const mockCategoryWithVariants: categoryService.CategoryWithVariantsTransformed =
      {
        id: 1,
        title: "Test Category",
        slug: "polos" as CategorySlug,
        hasVariants: true,
        description: "Test category description",
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryVariants: [
          {
            id: 1,
            value: "small",
            label: "S",
            priceModifier: 0, // ← CORREGIDO: number en lugar de Decimal
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 1,
          },
          {
            id: 2,
            value: "medium",
            label: "M",
            priceModifier: 2, // ← CORREGIDO: number en lugar de Decimal
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 2,
          },
          {
            id: 3,
            value: "large",
            label: "L",
            priceModifier: 3, // ← CORREGIDO: number en lugar de Decimal
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            sortOrder: 3,
          },
        ],
      };

    mockGetProductById.mockResolvedValue(mockProduct);
    mockGetCategoryWithVariants.mockResolvedValue(mockCategoryWithVariants);

    const result = await loader(createLoaderArgs("1"));

    expect(result.product).toBeDefined();
    expect(result.categoryWithVariants).toBeDefined();
    expect(result.product).toEqual(mockProduct);
    expect(result.categoryWithVariants).toEqual(mockCategoryWithVariants);

    expect(mockGetProductById).toHaveBeenCalledWith(1);
    expect(mockGetCategoryWithVariants).toHaveBeenCalledWith(1);
  });

  it("returns empty object when product does not exist", async () => {
    mockGetProductById.mockRejectedValue(new Error("Product not found"));

    const result = await loader(createLoaderArgs("999"));

    expect(result).toEqual({});
    expect(mockGetProductById).toHaveBeenCalledWith(999);
  });

  it("handles invalid product id", async () => {
    mockGetProductById.mockRejectedValue(new Error("Invalid ID"));

    const result = await loader(createLoaderArgs("invalid"));

    expect(result).toEqual({});
    expect(mockGetProductById).toHaveBeenCalledWith(NaN);
  });
});
