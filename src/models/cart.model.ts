import { type Product } from "./product.model";

import type { CategoryVariant } from "./category.model";
import type { Cart as PrismaCart } from "@/../generated/prisma/client";

export type Cart = PrismaCart;

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  categoryVariantId: number | null;
  quantity: number;
  finalPrice: number; // ← number, no Decimal
  createdAt: Date;
  updatedAt: Date;
  // Campos adicionales transformados
  product: Pick<
    Product,
    "id" | "title" | "imgSrc" | "alt" | "price" | "isOnSale"
  >;
  categoryVariant?: CategoryVariant | null;
};

export interface CartItemInput {
  productId: Product["id"];
  quantity: number;
  categoryVariantId: number | null;
  variantInfo: string | null;
  title: Product["title"];
  price: Product["price"];
  imgSrc: Product["imgSrc"];
}

// Tipo para representar un producto simplificado en el carrito

export type CartProductInfo = Pick<
  Product,
  "id" | "title" | "imgSrc" | "alt" | "price" | "isOnSale"
>;

// Tipo para representar un item de carrito con su producto
export type CartItemWithProduct = {
  product: CartProductInfo;
  quantity: number;
  categoryVariantId: number | null;
  finalPrice: number;
};

// Tipo para el carrito con items y productos incluidos
export type CartWithItems = Cart & {
  items: CartItem[];
};
