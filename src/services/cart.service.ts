import { type Cart, type CartItem, type User } from "generated/prisma/client";

import { prisma } from "@/db/prisma";
import { getSession } from "@/session.server";

import type { Decimal } from "@prisma/client/runtime/library";

// Tipo para representar un producto simplificado en el carrito
type CartProductInfo = {
  id: number;
  title: string;
  imgSrc: string;
  alt: string | null;
  price: Decimal;
  isOnSale: boolean;
};

// Tipo para representar un item de carrito con su producto
type CartItemWithProduct = {
  product: CartProductInfo;
  quantity: number;
};

// Tipo para el carrito con items y productos incluidos
type CartWithItems = Cart & {
  items: Array<CartItem & {
    product: CartProductInfo
  }>
};

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

  return await prisma.cart.findFirst({
    where: whereCondition,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              imgSrc: true,
              alt: true,
              price: true,
              isOnSale: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });
}

export async function getRemoteCart(userId: User["id"]): Promise<CartWithItems | null> {
  return await getCart(userId);
}

export async function getOrCreateCart(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined
): Promise<CartWithItems> {
  let cart = await getCart(userId, sessionCartId);

  // Si no se encontró un carrito creamos uno nuevo
  if (!cart) {
    // Creamos un carrito con userId si se proporciona
    cart = await prisma.cart.create({
      data: {
        userId: userId || null,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                imgSrc: true,
                alt: true,
                price: true,
                isOnSale: true,
              },
            },
          },
        },
      },
    });
  }

  if (!cart) throw new Error("Failed to create cart");

  return cart;
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

  // Si hay elementos para agregar, agregarlos
  if (items.length > 0) {
    await prisma.cartItem.createMany({
      data: items.map(item => ({
        cartId: cart.id,
        productId: item.product.id,
        quantity: item.quantity
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
  quantity: number = 1
): Promise<CartWithItems> {
  const cart = await getOrCreateCart(userId, sessionCartId);

  const existingItem = cart.items.find((item) => item.product.id === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity <= 0)
      throw new Error("Cannot set item quantity to 0 or less");

    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: newQuantity,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  const updatedCart = await getCart(
    userId,
    cart.sessionCartId,
    cart.id
  );

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
  
  // Eliminar todos los items del carrito primero
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
  
  // Luego eliminar el carrito
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
          product: {
            select: {
              id: true,
              title: true,
              imgSrc: true,
              alt: true,
              price: true,
              isOnSale: true,
            },
          },
        },
      },
    },
  });

  if (!updatedCart) throw new Error("Cart not found after linking");

  return updatedCart;
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
            product: {
              select: {
                id: true,
                title: true,
                imgSrc: true,
                alt: true,
                price: true,
                isOnSale: true,
              },
            },
          },
        },
      },
    });
    return updatedCart;
  }

  // Obtener productos duplicados para eliminarlos del carrito del usuario
  const guestProductIds = guestCart.items.map(item => item.productId);
  
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
  await Promise.all(
    guestCart.items.map(async (item) => {
      return prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    })
  );

  // Eliminar el carrito de invitado
  await prisma.cart.delete({
    where: { id: guestCart.id },
  });

  // Devolver el carrito actualizado del usuario
  return await getCart(userId);
}