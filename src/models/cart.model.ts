import type { Product, ProductVariant, StickersVariant } from "./product.model";
import type {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
} from "@/../generated/prisma/client";

export type Cart = PrismaCart;

// Este es el tipo para un item del carrito en nuestra aplicación.
// Extiende el tipo base de Prisma, pero asegura que los precios sean `number`
// y que las relaciones (product, variants) usen los tipos de nuestra aplicación.
export type CartItem = Omit<PrismaCartItem, "price"> & {
  product: Product;
  productVariant: ProductVariant | null;
  stickersVariant: StickersVariant | null;
  price: number; // El precio final del item en el carrito (puede ser de una variante)
};

// Este es el tipo principal para el Carrito en la aplicación.
export type CartWithItems = Omit<Cart, "items"> & {
  items: CartItem[];
};

export interface CartItemInput {
  productId: Product["id"];
  quantity: number;
  title: Product["title"];
  price: Product["price"];
  imgSrc: Product["imgSrc"];
}

export type CartItemWithProduct = CartItem;
