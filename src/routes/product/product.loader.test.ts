import { describe, expect, it, vi } from "vitest";

import { createTestProduct } from "@/lib/utils.tests";
import * as productService from "@/services/product.service";

import { loader } from ".";

// Mock the product service
vi.mock("@/services/product.service", () => ({
  getProductById: vi.fn(), // mock function
}));

const mockGetProductById = vi.mocked(productService.getProductById);

describe("Product loader", () => {
  const createLoaderArgs = (id: string) => ({
    params: { id },
    request: new Request(`http://localhost/products/${id}`),
    context: {},
  });

  it("returns a product when it exists", async () => {
    const mockProduct = createTestProduct();

    mockGetProductById.mockResolvedValue(mockProduct);

    const result = await loader(createLoaderArgs("1"));

    expect(result.product).toBeDefined();
    expect(result.product).toEqual(mockProduct);
    expect(mockGetProductById).toHaveBeenCalledWith(1);
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
