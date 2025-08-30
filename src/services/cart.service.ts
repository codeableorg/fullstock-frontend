import { prisma } from "@/db/prisma";
import type {
  CartItem,
  CartItemWithProduct,
  CartWithItems,
} from "@/models/cart.model";
import type { User } from "@/models/user.model";
import { getSession } from "@/session.server";

import type {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
  Product as PrismaProduct,
  ProductVariant as PrismaProductVariant,
  stickersVariant as PrismaStickersVariant,
} from "@/../generated/prisma/client";

// Este tipo representa la estructura de datos que devuelve Prisma
// cuando incluimos todas las relaciones de los items del carrito.
type PrismaCartItemWithDetails = PrismaCartItem & {
  product: PrismaProduct;
  productVariant: PrismaProductVariant | null;
  stickersVariant: PrismaStickersVariant | null;
};

type PrismaCartWithDetails = PrismaCart & {
  items: PrismaCartItemWithDetails[];
};

/**
 * Mapea un objeto de carrito de Prisma al modelo CartWithItems de la aplicación.
 * Esta función convierte los tipos Decimal a numbers para los precios.
 * @param prismaCart - El objeto de carrito obtenido de Prisma.
 * @returns El objeto de carrito mapeado, o null si la entrada es null.
 */
function mapPrismaCartToAppCart(
  prismaCart: PrismaCartWithDetails | null
): CartWithItems | null {
  if (!prismaCart) {
    return null;
  }

  const items: CartItem[] = prismaCart.items.map((item) => {
    const itemPrice =
      typeof item.price === "object" ? item.price.toNumber() : item.price;

    const productPrice =
      typeof item.product.price === "object"
        ? item.product.price.toNumber()
        : item.product.price;

    const stickerVariantPrice = item.stickersVariant?.price
      ? typeof item.stickersVariant.price === "object"
        ? item.stickersVariant.price.toNumber()
        : item.stickersVariant.price
      : undefined;

    return {
      ...item,
      price: itemPrice,
      product: {
        ...item.product,
        price: productPrice,
      },
      productVariant: item.productVariant,
      stickersVariant: item.stickersVariant
        ? { ...item.stickersVariant, price: stickerVariantPrice! }
        : null,
    };
  });

  return {
    ...prismaCart,
    items,
  };
}

// Función para obtener un carrito con sus ítems
async function getCart(
  userId?: number,
  sessionCartId?: string,
  id?: number
): Promise<CartWithItems | null> {
  const whereCondition = userId
    ? { userId }
    : sessionCartId
    ? { sessionCartId }
    : id
    ? { id }
    : undefined;

  if (!whereCondition) return null;

  const data = await prisma.cart.findFirst({
    where: whereCondition,
    include: {
      items: {
        include: {
          product: true,
          productVariant: true,
          stickersVariant: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!data) return null;

  return mapPrismaCartToAppCart(data);
}

export async function getRemoteCart(
  userId: User["id"]
): Promise<CartWithItems | null> {
  return await getCart(userId);
}

export async function getOrCreateCart(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined
): Promise<CartWithItems> {
  // Busca por userId o sessionCartId
  let cart = await getCart(userId, sessionCartId);

  // Si no se encontró, intenta buscar por sessionCartId 
  if (!cart && sessionCartId) {
    cart = await getCart(undefined, sessionCartId);
  }

  if (cart) {
    return cart;
  }

  // Solo crea si no existe ninguno con ese sessionCartId
  const newCart = await prisma.cart.create({
    data: {
      userId: userId || null,
      sessionCartId: sessionCartId || undefined,
    },
    include: {
      items: {
        include: {
          product: true,
          productVariant: true,
          stickersVariant: true,
        },
      },
    },
  });

  if (!newCart) throw new Error("Failed to create cart");

  const mappedCart = mapPrismaCartToAppCart(newCart);
  if (!mappedCart) {
    throw new Error("Failed to map newly created cart");
  }
  return mappedCart;
}

export async function createRemoteItems(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  items: CartItemWithProduct[] = []
): Promise<CartWithItems> {
  const cart = await getOrCreateCart(userId, sessionCartId);

  // Eliminar todos los ítems existentes en el carrito
  if (cart.items.length > 0) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  
  if (items.length > 0) {
    await prisma.cartItem.createMany({
      data: items.map((item) => ({
        cartId: cart.id,
        productId: item.product.id,
        quantity: item.quantity,
        productVariantId: item.productVariantId ?? null,
        stickersVariantId: item.stickersVariantId ?? null,
        price: item.price,
      })),
    });
  }

  const updatedCart = await getCart(userId, sessionCartId, cart.id);

  if (!updatedCart) throw new Error("Cart not found after creation");

  return updatedCart;
}

export async function alterQuantityCartItem(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  productId: number,
  quantity: number = 1,
  productVariantId?: number,
  stickersVariantId?: number
): Promise<CartWithItems> {
  const cart = await getOrCreateCart(userId, sessionCartId);

  let existingItem;

  if (stickersVariantId) {
    
    existingItem = cart.items.find(
      (item) =>
        item.productId === productId &&
        item.stickersVariantId === stickersVariantId
    );
  } else {
   
    existingItem = cart.items.find(
      (item) =>
        item.productId === productId &&
        item.productVariantId === (productVariantId ?? null) &&
        item.stickersVariantId === null 
    );
  }

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity <= 0)
      throw new Error("Cannot set item quantity to 0 or less");

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else if (quantity > 0) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: true,
        stickersVariants: true,
      },
    });
    if (!product) throw new Error(`Product with id ${productId} not found`);

    let price =
      typeof product.price === "object"
        ? product.price.toNumber()
        : product.price;

    if (stickersVariantId) {
      const stickerVariant = await prisma.stickersVariant.findUnique({
        where: { id: stickersVariantId },
      });
      if (!stickerVariant)
        throw new Error(
          `Sticker variant with id ${stickersVariantId} not found`
        );
      if (stickerVariant.price) {
        price =
          typeof stickerVariant.price === "object"
            ? stickerVariant.price.toNumber()
            : stickerVariant.price;
      }
    } else if (productVariantId) {
      const productVariant = await prisma.productVariant.findUnique({
        where: { id: productVariantId },
      });
      if (!productVariant)
        throw new Error(
          `Product variant with id ${productVariantId} not found`
        );
    }
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        productVariantId: productVariantId ?? null,
        stickersVariantId: stickersVariantId ?? null,
        price, 
      },
    });
  }

  const updatedCart = await getCart(userId, cart.sessionCartId, cart.id);

  if (!updatedCart) throw new Error("Cart not found after update");

  return updatedCart;
}

export async function deleteRemoteCartItem(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  itemId: number
): Promise<CartWithItems> {
  const cart = await getCart(userId, sessionCartId);

  if (!cart) throw new Error("Cart not found");

  await prisma.cartItem.delete({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  const updatedCart = await getOrCreateCart(userId, sessionCartId);
  return updatedCart;
}

export async function deleteRemoteCart(request: Request): Promise<void> {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  const cart = await getCart(userId, sessionCartId);

  if (!cart) throw new Error("Cart not found");

  
  await prisma.cart.delete({
    where: { id: cart.id },
  });
}

export async function linkCartToUser(
  userId: User["id"],
  sessionCartId: string
): Promise<CartWithItems> {
  if (!sessionCartId) throw new Error("Session cart ID not found");
  if (!userId) throw new Error("User ID not found");

  const updatedCart = await prisma.cart.update({
    where: { sessionCartId },
    data: { userId },
    include: {
      items: {
        include: {
          product: true,
          productVariant: true,
          stickersVariant: true,
        },
      },
    },
  });

  if (!updatedCart) throw new Error("Cart not found after linking");

  const mappedCart = mapPrismaCartToAppCart(updatedCart);

  if (!mappedCart) {
    throw new Error("Failed to map linked cart");
  }

  return mappedCart;
}

export async function mergeGuestCartWithUserCart(
  userId: User["id"],
  sessionCartId: string
): Promise<CartWithItems | null> {
  // Obtener el carrito de usuario y el carrito de invitado
  const userCart = await getCart(userId);
  const guestCart = await getCart(undefined, sessionCartId);

  if (!guestCart) {
    return userCart;
  }

  if (!userCart) {
    // Si el usuario no tiene carrito, actualizamos el carrito de invitado con el ID del usuario
    const updatedCart = await prisma.cart.update({
      where: { sessionCartId },
      data: { userId },
      include: {
        items: {
          include: {
            product: true,
            productVariant: true,
            stickersVariant: true,
          },
        },
      },
    });
    return mapPrismaCartToAppCart(updatedCart);
  }

  // Obtener productos duplicados para eliminarlos del carrito del usuario
  const guestProductIds = guestCart.items.map((item) => item.productId);

  // Eliminar productos del carrito usuario que también existan en el carrito invitado
  await prisma.cartItem.deleteMany({
    where: {
      cartId: userCart.id,
      productId: {
        in: guestProductIds,
      },
    },
  });

  // Mover los items del carrito de invitado al carrito de usuario
  await prisma.cartItem.createMany({
    data: guestCart.items.map((item) => ({
      cartId: userCart.id,
      productId: item.productId,
      quantity: item.quantity,
      productVariantId: item.productVariantId ?? null,
      stickersVariantId: item.stickersVariantId ?? null,
      price: item.price,
    })),
  });

  // Eliminar el carrito de invitado
  await prisma.cart.delete({
    where: { id: guestCart.id },
  });

  // Devolver el carrito actualizado del usuario
  return await getCart(userId);
}
