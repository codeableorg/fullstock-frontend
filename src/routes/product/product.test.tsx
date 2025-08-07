import { render, screen } from "@testing-library/react";
import { useNavigation } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { createTestProduct } from "@/lib/utils.tests";
import type { Product as ProductType } from "@/models/product.model";

import Product from ".";

import type { Route } from "./+types";

// Helper function to create a test navigation object
const createTestNavigation = (overrides = {}) => ({
  state: "idle" as const,
  location: undefined,
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
  formData: undefined,
  json: undefined,
  text: undefined,
  ...overrides,
});

// Mock de react-router
vi.mock("react-router", () => ({
  Form: vi.fn(({ children }) => <form>{children}</form>),
  useNavigation: vi.fn(() => createTestNavigation()),
  Link: vi.fn(({ children, ...props }) => <a {...props}>{children}</a>),
}));

const createTestProps = (
  productData: Partial<ProductType> = {}
): Route.ComponentProps => ({
  loaderData: { product: createTestProduct(productData) },
  params: { id: "123" },
  // Hack to satisfy type requirements
  matches: [] as unknown as Route.ComponentProps["matches"],
});

describe("Product Component", () => {
  describe("Rendering with valid product data", () => {
    it("should render product title correctly", () => {
      // Step 1: Setup - Create test props
      const props = createTestProps({ title: "Awesome Product" });
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call - Render component
      render(<Product {...props} />);
      // Step 4: Verify - Check title is rendered correctly
      const titleElement = screen.getByRole("heading", { level: 1 });
      expect(titleElement).toHaveTextContent("Awesome Product");
    });

    it("should render product price with correct currency", () => {
      // Step 1: Setup - Create test props
      const props = createTestProps({ price: 150.99 });
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call - Render component
      render(<Product {...props} />);
      // Step 4: Verify - Check price is rendered correctly
      expect(screen.queryByText("S/150.99")).toBeInTheDocument();
    });

    it("should render product description", () => {
      // Step 1: Setup - Create test props
      const props = createTestProps({
        description: "Amazing product",
      });
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call - Render component
      render(<Product {...props} />);
      // Step 4: Verify - Check description is rendered
      expect(screen.queryByText("Amazing product")).toBeInTheDocument();
    });

    it("should render product image with correct src and alt attributes", () => {
      // Step 1: Setup - Create test props
      const props = createTestProps({
        imgSrc: "/test-image.jpg",
        alt: "Test Product",
      });
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call - Render component
      render(<Product {...props} />);
      // Step 4: Verify - Check image attributes
      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/test-image.jpg");
      expect(image).toHaveAttribute("alt", "Test Product");
    });

    it("should render all product features as list items", () => {
      // Step 1: Setup - Create test props
      const features = ["Feature 1", "Feature 2", "Feature 3"];
      const props = createTestProps({ features });
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call - Render component
      render(<Product {...props} />);
      // Step 4: Verify - Check features are rendered
      features.forEach((feature) => {
        expect(screen.queryByText(feature)).toBeInTheDocument();
      });
    });

    it('should render "Agregar al Carrito" button', () => {
      // Step 1: Setup - Create test props
      const props = createTestProps();
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call - Render component
      render(<Product {...props} />);
      // Step 4: Verify - Check button is present
      expect(
        screen.queryByRole("button", { name: "Agregar al Carrito" })
      ).toBeInTheDocument();
    });
  });

  describe("Form interactions", () => {
    it("should include hidden redirectTo input with correct value", () => {
      // Step 1: Setup
      const productId = 123;
      const props = createTestProps({ id: productId });
      // Step 2: Mock - Component mocks already set up above
      // Step 3: Call
      render(<Product {...props} />);
      // Step 4: Verify
      const redirectInput = screen.queryByDisplayValue(
        `/products/${productId}`
      );
      expect(redirectInput).toBeInTheDocument();
    });

    it("should disable button when cart is loading", () => {
      // Step 1: Setup
      const props = createTestProps();
      const expectedNavigation = createTestNavigation({ state: "submitting" });
      // Step 2: Mock - Override navigation state to simulate loading
      vi.mocked(useNavigation).mockReturnValue(expectedNavigation);
      // Step 3: Call
      render(<Product {...props} />);
      // Step 4: Verify
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("Agregando...");
    });
  });

  describe("Error handling", () => {
    it("should render NotFound component when product is not provided", () => {
      // Step 1: Setup - Create props without product
      const props = createTestProps();
      props.loaderData.product = undefined;

      // Step 2: Mock - Mock NotFound component
      // vi.mock("../not-found", () => ({
      //   default: () => <div data-testid="not-found">Not Found Page</div>,
      // }));
      // Step 3: Call
      render(<Product {...props} />);
      // Step 4: Verify
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
  });
});
