import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTestCategory } from "@/lib/utils.tests";
import * as categoriesRepository from "@/repositories/category.repository";
import {
  getAllCategories,
  getCategoryBySlug,
} from "@/services/category.service";

// Mock the repository
vi.mock("@/repositories/category.repository");

describe("Category Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCategories", () => {
    it("should return all categories", async () => {
      const mockCategories = [
        createTestCategory(),
        createTestCategory({
          id: 2,
          slug: "stickers",
          title: "Stickers",
          imgSrc: "/img/stickers.jpg",
          alt: "Colección de stickers para programadores",
          description:
            "Explora nuestra colección de stickers para programadores",
        }),
      ];

      vi.mocked(categoriesRepository.getAllCategories).mockResolvedValue(
        mockCategories
      );

      const result = await getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(categoriesRepository.getAllCategories).toHaveBeenCalledTimes(1);
    });

    it("should handle empty categories", async () => {
      vi.mocked(categoriesRepository.getAllCategories).mockResolvedValue([]);

      const result = await getAllCategories();

      expect(result).toEqual([]);
      expect(categoriesRepository.getAllCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCategoryBySlug", () => {
    it("should return category when found", async () => {
      const mockCategory = createTestCategory();

      vi.mocked(categoriesRepository.getCategoryBySlug).mockResolvedValue(
        mockCategory
      );

      const result = await getCategoryBySlug("polos");

      expect(result).toEqual(mockCategory);
      expect(categoriesRepository.getCategoryBySlug).toHaveBeenCalledWith(
        "polos"
      );
    });

    it("should throw error when category not found", async () => {
      vi.mocked(categoriesRepository.getCategoryBySlug).mockResolvedValue(null);

      await expect(getCategoryBySlug("non-existent")).rejects.toThrow(
        'Category with slug "non-existent" not found'
      );
    });
  });
});
