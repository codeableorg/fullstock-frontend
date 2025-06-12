import { describe, it, expect, vi, beforeEach } from "vitest";
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
        {
          id: 1,
          name: "Category 1",
          slug: "polos" as "polos",
          title: "Category 1 Title",
          imgSrc: "/img/category-1.jpg",
          alt: "Category 1 image",
          description: "Description for Category 1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Category 2",
          slug: "stickers" as "stickers",
          title: "Category 2 Title",
          imgSrc: "/img/category-2.jpg",
          alt: "Category 2 image",
          description: "Description for Category 2",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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
      const mockCategory = {
        id: 1,
        name: "Category 1",
        slug: "polos" as "polos",
        title: "Category 1 Title",
        imgSrc: "/img/category-1.jpg",
        alt: "Category 1 image",
        description: "Description for Category 1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

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
