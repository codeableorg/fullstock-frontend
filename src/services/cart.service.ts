import { prisma } from "@/db/prisma";
import type { CartItemWithProduct, CartWithItems } from "@/models/cart.model";
import type { User } from "@/models/user.model";
import { getSession } from "@/session.server";

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
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (!data) return null;

  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: typeof item.product.price === "object"
          ? item.product.price.toNumber()
          : item.product.price,
      },
      productVariant: item.productVariant ?? null,
      productVariantId: item.productVariantId ?? null,
    })),
  };
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

  // Si no se encontró, intenta buscar explícitamente por sessionCartId (por si acaso)
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
        },
      },
    },
  });

  if (!newCart) throw new Error("Failed to create cart");

  return {
    ...newCart,
    items: newCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: typeof item.product.price === "object"
          ? item.product.price.toNumber()
          : item.product.price,
      },
      productVariant: item.productVariant ?? null,
      productVariantId: item.productVariantId ?? null,
    })),
  };
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
      data: items.map((item) => ({
        cartId: cart.id,
        productId: item.product.id,
        quantity: item.quantity,
        productVariantId: item.productVariantId ?? null,
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
  productVariantId?: number
): Promise<CartWithItems> {
  const cart = await getOrCreateCart(userId, sessionCartId);

  // Busca por productId y productVariantId (si existe)
  const existingItem = cart.items.find(
    (item) =>
      item.product.id === productId &&
      (productVariantId
        ? item.productVariantId === productVariantId
        : !item.productVariantId)
  );

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
        productVariantId: productVariantId ?? null,
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

  // Eliminar todos los items del carrito primero
  // await prisma.cartItem.deleteMany({
  //   where: { cartId: cart.id },
  // });

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
          product: true,
          productVariant: true,
        },
      },
    },
  });

  if (!updatedCart) throw new Error("Cart not found after linking");

  return {
    ...updatedCart,
    items: updatedCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: typeof item.product.price === "object"
          ? item.product.price.toNumber()
          : item.product.price,
      },
      productVariant: item.productVariant ?? null,
      productVariantId: item.productVariantId ?? null,
    })),
  };
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
          },
        },
      },
    });
    return {
      ...updatedCart,
      items: updatedCart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: typeof item.product.price === "object"
            ? item.product.price.toNumber()
            : item.product.price,
        },
        productVariant: item.productVariant ?? null,
        productVariantId: item.productVariantId ?? null,
      })),
    };
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
    })),
  });

  // Eliminar el carrito de invitado
  await prisma.cart.delete({
    where: { id: guestCart.id },
  });

  // Devolver el carrito actualizado del usuario
  return await getCart(userId);
}