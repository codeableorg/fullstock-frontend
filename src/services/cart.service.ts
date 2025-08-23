import { prisma } from "@/db/prisma";
import type {
  CartItem,
  CartItemWithProduct,
  CartWithItems,
} from "@/models/cart.model";
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

  try {
    const data = await prisma.cart.findFirst({
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
            categoryVariant: {
              // ✅ CRÍTICO: Incluir esta relación
              select: {
                id: true,
                label: true,
                value: true,
                priceModifier: true,
              },
            },
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!data) return null;

    return {
      ...data,
      items: data.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        categoryVariantId: item.categoryVariantId,
        quantity: item.quantity,
        finalPrice: item.finalPrice
          ? Number(item.finalPrice)
          : Number(item.product.price),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
        categoryVariant: item.categoryVariant
          ? {
              id: item.categoryVariant.id,
              label: item.categoryVariant.label,
              value: item.categoryVariant.value,
              priceModifier: Number(item.categoryVariant.priceModifier),
            }
          : null,
      })),
    };
  } catch (error) {
    console.error("Error in getCart:", error);
    return null;
  }
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
  try {
    const cart = await getCart(userId, sessionCartId);

    if (cart) {
      return cart;
    }
    const newCart = await prisma.cart.create({
      data: {
        userId: userId || null,
        sessionCartId: sessionCartId,
      },
    });

    if (!newCart) {
      throw new Error("Failed to create new cart");
    }

    // ✅ IMPORTANTE: Usar getCart para obtener el carrito con todas las relaciones
    const cartWithItems = await getCart(
      newCart.userId || undefined,
      newCart.sessionCartId || undefined,
      newCart.id
    );

    if (!cartWithItems) {
      throw new Error("Failed to fetch cart after creation");
    }

    return cartWithItems;
  } catch (error) {
    console.error("Error in getOrCreateCart:", error);
    throw new Error(`Failed to get or create cart: ${error}`);
  }
}

export async function createRemoteItems(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  items: CartItem[] = []
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
        categoryVariantId: item.categoryVariantId,
        finalPrice: item.finalPrice,
      })),
    });
  }

  const updatedCart = await getCart(
    cart.userId || undefined,
    cart.sessionCartId || undefined,
    cart.id
  );

  if (!updatedCart) throw new Error("Cart not found after creation");

  return updatedCart;
}

export async function alterQuantityCartItem(
  userId: User["id"] | undefined,
  sessionCartId: string | undefined,
  productId: number,
  quantity: number = 1,
  categoryVariantId: number | null = null
): Promise<CartWithItems> {
  const cart = await getOrCreateCart(userId, sessionCartId);

  const existingItem = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.categoryVariantId === categoryVariantId
  );

  const finalPrice = await calculateFinalPrice(productId, categoryVariantId);

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
        finalPrice,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        categoryVariantId,
        quantity,
        finalPrice,
      },
    });
  }

  const updatedCart = await getCart(userId, cart.sessionCartId, cart.id);

  if (!updatedCart) throw new Error("Cart not found after update");

  return updatedCart;
}

async function calculateFinalPrice(
  productId: number,
  categoryVariantId: number | null
): Promise<number> {
  // Obtener producto
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { price: true },
  });

  if (!product) throw new Error("Product not found");

  let finalPrice = Number(product.price);

  // Si hay variante, sumar el modificador
  if (categoryVariantId) {
    const variant = await prisma.categoryVariant.findUnique({
      where: { id: categoryVariantId },
      select: { priceModifier: true },
    });

    if (variant) {
      finalPrice += Number(variant.priceModifier);
    }
  }

  return finalPrice;
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

  return {
    ...updatedCart,
    items: updatedCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
      finalPrice: Number(item.finalPrice),
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
    return {
      ...updatedCart,
      items: updatedCart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
        finalPrice: Number(item.finalPrice),
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
    data: await Promise.all(
      guestCart.items.map(async (item) => ({
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
        categoryVariantId: item.categoryVariantId ?? null,
        finalPrice: await calculateFinalPrice(
          item.productId,
          item.categoryVariantId ?? null
        ),
      }))
    ),
  });

  // Eliminar el carrito de invitado
  await prisma.cart.delete({
    where: { id: guestCart.id },
  });

  // Devolver el carrito actualizado del usuario
  return await getCart(userId);
}
