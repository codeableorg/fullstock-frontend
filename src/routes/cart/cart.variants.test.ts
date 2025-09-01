import { describe, it, expect } from "vitest";

import { calculateTotal } from "@/lib/cart";
import type { CartItem, CartItemInput } from "@/models/cart.model";

describe("calculateTotal with product variants", () => {
  it("sums using variant prices when present (CartItem)", () => {
    const items = [
      {
        id: 1,
        cartId: 1,
        productId: 101,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: 101,
          title: "Sticker Docker",
          imgSrc: "/stickers/docker.png",
          alt: "Sticker Docker",
          price: 2.99,
          isOnSale: false,
        },
        productVariant: {
          id: 1001,
          type: "tamaño",
          value: "3x3cm",
          price: 2.99,
        },
      },
      {
        id: 2,
        cartId: 1,
        productId: 101,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: 101,
          title: "Sticker Docker",
          imgSrc: "/stickers/docker.png",
          alt: "Sticker Docker",
          price: 2.99,
          isOnSale: false,
        },
        productVariant: {
          id: 1002,
          type: "tamaño",
          value: "10x10cm",
          price: 9.95,
        },
      },
    ] as unknown as CartItem[];

    const total = calculateTotal(items);
    expect(total).toBeCloseTo(12.94, 2);
  });

  it("falls back to product base price when no variant (CartItem)", () => {
    const items = [
      {
        id: 1,
        cartId: 1,
        productId: 201,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: 201,
          title: "Taza React",
          imgSrc: "/tazas/react.png",
          alt: "Taza React",
          price: 13.99,
          isOnSale: false,
        },
        productVariant: null,
      },
    ] as unknown as CartItem[];

    const total = calculateTotal(items);
    expect(total).toBeCloseTo(27.98, 2);
  });

  it("sums CartItemInput (flattened) correctly for variants", () => {
    const items: CartItemInput[] = [
      {
        productId: 301,
        title: "Sticker JS (3x3cm)",
        price: 2.99,
        imgSrc: "/stickers/js.png",
        quantity: 1,
      },
      {
        productId: 301,
        title: "Sticker JS (10x10cm)",
        price: 9.95,
        imgSrc: "/stickers/js.png",
        quantity: 2,
      },
    ];

    const total = calculateTotal(items);
    expect(total).toBeCloseTo(22.89, 2);
  });
});
