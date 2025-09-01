import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { calculateTotal } from "@/lib/cart";
import type { CartWithItems } from "@/models/cart.model";

import Cart from ".";

import type { Route } from "./+types";

// Mock react-router Form/Link to render as plain elements preserving props
vi.mock("react-router", () => ({
  Form: vi.fn(({ children, ...props }) => <form {...props}>{children}</form>),
  Link: vi.fn(({ children, ...props }) => <a {...props}>{children}</a>),
  // minimal mock for session.server usage
  createCookieSessionStorage: vi.fn(() => ({
    getSession: vi.fn(async () => ({
      get: vi.fn(),
      set: vi.fn(),
    })),
    commitSession: vi.fn(),
    destroySession: vi.fn(),
  })),
}));

function createLoaderData(): Route.ComponentProps["loaderData"] {
  const product = {
    id: 1,
    title: "Polo React",
    imgSrc: "/polos/polo-react.png",
    alt: "Polo React",
    price: 20,
    isOnSale: false,
  };

  const items: CartWithItems["items"] = [
    {
      id: 1,
      cartId: 1,
      productId: product.id,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      productVariantId: 10,
      product,
      productVariant: {
        id: 10,
        type: "talla",
        value: "Large",
        price: 20,
      },
    },
    {
      id: 2,
      cartId: 1,
      productId: product.id,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      productVariantId: 11,
      product,
      productVariant: {
        id: 11,
        type: "talla",
        value: "Medium",
        price: 20,
      },
    },
  ];

  const cart = {
    id: 1,
    items,
    sessionCartId: "test-session",
    userId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as CartWithItems;

  return {
    cart,
    total: calculateTotal(items),
  };
}

const createProps = (): Route.ComponentProps => ({
  loaderData: createLoaderData(),
  params: {},
  matches: [] as unknown as Route.ComponentProps["matches"],
});

describe("Cart Route - variants rendering", () => {
  it("renders same product with different variants as separate items and shows correct total", () => {
    const props = createProps();
    render(<Cart {...props} />);

    expect(screen.getByText("Polo React (Large)")).toBeInTheDocument();
    expect(screen.getByText("Polo React (Medium)")).toBeInTheDocument();

    // Each item shows price and image
    const priceLabels = screen.getAllByText("S/20.00");
    expect(priceLabels).toHaveLength(2);

    const images = screen.getAllByRole("img", { name: /polo react/i });
    expect(images.length).toBeGreaterThanOrEqual(2);

    // Total equals sum of both variants
    expect(screen.getByText("S/40.00")).toBeInTheDocument();

    // Each row has independent +/- forms carrying its productVariantId
    const container = screen.getByText("Carrito de compras").closest("div")!;
    const variantForms = Array.from(
      container.querySelectorAll('form[action="/cart/add-item"]')
    );

    // There are two forms per row (minus, plus)
    expect(variantForms.length).toBeGreaterThanOrEqual(4);

    // Check hidden inputs exist for productId and productVariantId for first row forms
    const firstRowForms = variantForms.slice(0, 2);
    firstRowForms.forEach((form) => {
      const productIdInput = (form as HTMLElement).querySelector(
        'input[name="productId"][value="1"]'
      ) as HTMLInputElement | null;
      expect(productIdInput).not.toBeNull();
      const variantInput = (form as HTMLElement).querySelector(
        'input[name="productVariantId"][value="10"]'
      ) as HTMLInputElement | null;
      expect(variantInput).not.toBeNull();
    });
  });
});
