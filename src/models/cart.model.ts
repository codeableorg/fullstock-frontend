import { type Product } from "./product.model";

import type { CategoryVariant } from "./category.model";
import type { Cart as PrismaCart } from "@/../generated/prisma/client";
import type { Nullable } from "./utils.model";

export type Cart = PrismaCart;

type productInfo = Pick<
  Product,
  "id" | "title" | "imgSrc" | "alt" | "price" | "isOnSale"
>;

export type CartItem = {
  id: number;
  cartId: number;
  productId: number;
  categoryVariantId: Nullable<number>;
  quantity: number;
  finalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  product: productInfo;
  categoryVariant?: Nullable<CategoryVariant>;
};

export interface CartItemInput {
  productId: Product["id"];
  quantity: number;
  categoryVariantId: Nullable<number>;
  variantInfo: Nullable<string>;
  title: Product["title"];
  price: Product["price"];
  imgSrc: Product["imgSrc"];
}

// Tipo para representar un item de carrito con su producto
export type CartItemWithProduct = {
  product: productInfo;
  quantity: number;
  categoryVariantId: Nullable<number>;
  finalPrice: number;
};

// Tipo para el carrito con items y productos incluidos
export type CartWithItems = Cart & {
  items: CartItem[];
};
