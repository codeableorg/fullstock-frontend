import { type Product } from "./product.model";

import type {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
} from "@/../generated/prisma/client";

export type CartItem = PrismaCartItem & {
  product: Pick<
    Product,
    "id" | "title" | "imgSrc" | "alt" | "price" | "isOnSale"
  >;
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
  attributeId: number;
};

// Tipo para el carrito con items y productos incluidos
export type CartWithItems = Cart & {
  items: CartItem[];
};
