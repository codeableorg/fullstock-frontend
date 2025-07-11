import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma as mockPrisma } from "@/db/prisma";
import { createTestCategory } from "@/lib/utils.tests";
import {
  getAllCategories,
  getCategoryBySlug,
} from "@/services/category.service";

vi.mock("@/db/prisma", () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

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

      vi.mocked(mockPrisma.category.findMany).mockResolvedValue(mockCategories);

      const result = await getAllCategories();

      expect(result).toEqual(mockCategories);
      expect(mockPrisma.category.findMany).toHaveBeenCalledTimes(1);
    });

    it("should handle empty categories", async () => {
      vi.mocked(mockPrisma.category.findMany).mockResolvedValue([]);

      const result = await getAllCategories();

      expect(result).toEqual([]);
      expect(mockPrisma.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCategoryBySlug", () => {
    it("should return category when found", async () => {
      const mockCategory = createTestCategory();

      vi.mocked(mockPrisma.category.findUnique).mockResolvedValue(mockCategory);

      const result = await getCategoryBySlug("polos");

      expect(result).toEqual(mockCategory);
      expect(mockPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { slug: "polos" },
      });
    });

    it("should throw error when category not found", async () => {
      vi.mocked(mockPrisma.category.findUnique).mockResolvedValue(null);

      await expect(getCategoryBySlug("polos")).rejects.toThrow(
        'Category with slug "polos" not found'
      );
    });
  });
});
