import { type Product } from "./product.model";

import type {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
} from "@/../generated/prisma/client";

export type CartItem = PrismaCartItem & {
  product: Pick<Product, "id" | "title" | "imgSrc" | "alt" | "price" | "isOnSale">;
  productVariant?: {
    id: number;
    size: "small" | "medium" | "large";
  } | null;
  stickersVariant?: {
    id: number;
    measure: "3*3" | "5*5" | "10*10";
  } | null;
};

export type Cart = PrismaCart;

export interface CartItemInput {
  productId: Product["id"];
  quantity: number;
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
  productVariantId: number | null;
  stickersVariantId: number | null;
  price: number;
};

// Tipo para el carrito con items y productos incluidos
export type CartWithItems = Cart & {
  items: CartItem[];
};
