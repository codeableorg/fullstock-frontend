import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createTestProduct, createTestVariantAttributeValue } from "@/lib/utils.tests";
import type { Product as ProductModel, VariantAttributeValueWithNumber } from "@/models/product.model";

import Product from ".";

import type { Route } from "./+types";

// Mock de react-router
vi.mock("react-router", () => {
  const actual = vi.importActual("react-router"); // mantener los demás exports reales
  return {
    ...actual,
    Form: vi.fn(({ children }) => <form>{children}</form>),
    useNavigation: vi.fn(() => ({ state: "idle" } )),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
    Link: vi.fn(({ children, ...props }) => <a {...props}>{children}</a>),
  };
});

const createTestProps = (
  productData: Partial<ProductModel> = {}
): Route.ComponentProps => ({
  loaderData: { product: createTestProduct(productData) },
  params: { id: "123" },
  matches: [] as unknown as Route.ComponentProps["matches"],
});

describe("Product Component", () => {
  describe("Rendering with valid product data", () => {
    it("should render product title correctly", () => {
      const props = createTestProps({ title: "Awesome Product" });
      render(<Product {...props} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Awesome Product");
    });

    it("should render product price with correct currency", () => {
     const props = createTestProps({
  categoryId: 1, // Para que el componente muestre variantes
  variantAttributeValues: [
    createTestVariantAttributeValue({ id: 1, value: "S", price: 100 }),
    createTestVariantAttributeValue({ id: 2, value: "M", price: 120 }),
  ],
});
      render(<Product {...props} />);
      expect(screen.getByText("S/100.00")).toBeInTheDocument();
    });

    it("should render product description", () => {
      const props = createTestProps({ description: "Amazing product" });
      render(<Product {...props} />);
      expect(screen.getByText("Amazing product")).toBeInTheDocument();
    });

    it("should render product image with correct src and alt", () => {
      const props = createTestProps({
        imgSrc: "/test-image.jpg",
        alt: "Test Product",
      });
      render(<Product {...props} />);
      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Test Product");
    });

    it("should render all product features as list items", () => {
      const features = ["Feature 1", "Feature 2", "Feature 3"];
      const props = createTestProps({ features });
      render(<Product {...props} />);
      features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument();
      });
    });

    it('should render "Agregar al Carrito" button', () => {
      const props = createTestProps();
      render(<Product {...props} />);
      expect(screen.getByRole("button", { name: "Agregar al Carrito" })).toBeInTheDocument();
    });

    it("should render variants and update price when variant is selected", () => {
      const props = createTestProps({
        categoryId: 1,
        variantAttributeValues: [
          {
            id: 1,
            attributeId: 1,
            productId: 1,
            value: "S",
            price: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
            variantAttribute: { id: 1, name: "Talla" },
          },
          {
            id: 2,
            attributeId: 1,
            productId: 1,
            value: "M",
            price: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
            variantAttribute: { id: 1, name: "Talla" },
          },
        ] as VariantAttributeValueWithNumber[],
      });

      render(<Product {...props} />);

      const smallBtn = screen.getByRole("button", { name: "S" });
      const mediumBtn = screen.getByRole("button", { name: "M" });
      expect(smallBtn).toBeInTheDocument();
      expect(mediumBtn).toBeInTheDocument();

      expect(screen.getByText("S/100.00")).toBeInTheDocument();

      fireEvent.click(mediumBtn);
      expect(screen.getByText("S/120.00")).toBeInTheDocument();
    });
  });
});
