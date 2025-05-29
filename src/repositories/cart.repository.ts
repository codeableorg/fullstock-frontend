import * as db from "@/db";
import { type Cart, type CartItem } from "@/models/cart.model";

export async function getCart(
  userId: number | undefined,
  sessionCartId: string | undefined,
  id?: number
): Promise<Cart | null> {
  let whereClause: string;
  let paramValue: number | string;

  if (userId) {
    whereClause = "WHERE c.user_id = $1";
    paramValue = userId;
  } else if (sessionCartId) {
    whereClause = "WHERE c.session_cart_id = $1";
    paramValue = sessionCartId;
  } else if (id) {
    whereClause = "WHERE c.id = $1";
    paramValue = id;
  } else {
    // Si no se proporciona ningún identificador, devolvemos null
    return null;
  }

  const query = `
    SELECT 
      c.*,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'id', ci.id,
              'quantity', ci.quantity,
              'product', (
                SELECT json_build_object(
                  'id', p.id,
                  'title', p.title,
                  'imgSrc', p.img_src,
                  'alt', p.alt,
                  'price', p.price,
                  'isOnSale', p.is_on_sale
                )
                FROM products p
                WHERE p.id = ci.product_id
              ),
              'createdAt', ci.created_at,
              'updatedAt', ci.updated_at
            )
          ORDER BY ci.id ASC
          )
          FROM cart_items ci 
			    LEFT JOIN products pr on pr.id = ci.product_id
          WHERE ci.cart_id = c.id
        )::json,
        '[]'::json
      ) as items
    FROM carts c
    ${whereClause}
  `;
  return await db.queryOne<Cart>(query, [paramValue]);
}

export async function createCart(): Promise<Cart | null> {
  const query = "INSERT INTO carts DEFAULT VALUES RETURNING *";
  const cart = await db.queryOne<Cart>(query);
  return getCart(undefined, undefined, cart?.id);
}

// export async function createGuestCart(sessionCartId: string): Promise<Cart | null> { // new function
//   const query = "INSERT INTO carts (session_cart_id) VALUES ($1) RETURNING *";
//   return db.queryOne<Cart>(query, [sessionCartId]);
// }

export async function addCartItem(
  cartId: number,
  productId: number,
  quantity: number
): Promise<CartItem | null> {
  const query = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  return await db.queryOne<CartItem>(query, [cartId, productId, quantity]);
}

export async function addCartItems(
  cartId: number,
  items: { productId: number; quantity: number }[] | []
): Promise<CartItem[]> {
  // Si no hay elementos para agregar, retornar un array vacío
  if (items.length === 0) {
    return [];
  }

  const valuesClause = items
    .map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`)
    .join(",");

  const query = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES ${valuesClause}
    RETURNING *
  `;

  const values = items.reduce(
    (acc, item) => {
      acc.push(item.productId, item.quantity);
      return acc;
    },
    [cartId] as (string | number)[]
  );

  return await db.query<CartItem>(query, values);
}

export async function updateCartItem(
  cartId: number,
  itemId: number,
  quantity: number
): Promise<CartItem | null> {
  const query =
    "UPDATE cart_items SET quantity = $1 WHERE id = $2 AND cart_id = $3 RETURNING *";

  return await db.queryOne<CartItem>(query, [quantity, itemId, cartId]);
}

export async function removeCartItem(
  cartId: number,
  itemId: number
): Promise<void> {
  const query = "DELETE FROM cart_items WHERE id = $1 AND cart_id = $2";
  await db.query(query, [itemId, cartId]);
}

export async function clearCart(cartId: number): Promise<void> {
  const query = "DELETE FROM carts WHERE id = $1";
  await db.query(query, [cartId]);
}

export async function updateCartWithUserId(
  cartId: number,
  userId: number
): Promise<Cart | null> {
  const query = `
    UPDATE carts
    SET user_id = $2
    WHERE id = $1
    RETURNING *
  `;

  return await db.queryOne<Cart>(query, [cartId, userId]);
}

export async function updateCartBySessionId(
  sessionCartId: string,
  userId: number
): Promise<Cart | null> {
  const query = `
    UPDATE carts
    SET user_id = $2
    WHERE session_cart_id = $1
    RETURNING *
  `;

  return await db.queryOne<Cart>(query, [sessionCartId, userId]);
}

export async function mergeGuestCartWithUserCart(
  userId: number | null,
  sessionCartId: string
): Promise<Cart | null> {
  // Primero, obtenemos el carrito del usuario y el carrito de invitado
  const userCart = await getCart(userId);
  const guestCart = await getCart(null, sessionCartId);

  if (!guestCart) {
    return userCart;
  }

  if (!userCart) {
    // Si el usuario no tiene carrito, actualizamos el carrito de invitado con el ID del usuario
    const query = `
      UPDATE carts 
      SET user_id = $1
      WHERE session_cart_id = $2
      RETURNING *
    `;
    return await db.queryOne<Cart>(query, [userId, sessionCartId]);
  }

  // Eliminamos productos del carrito usuario que también existan en el carrito invitado
  await db.query(
    `
    DELETE FROM cart_items 
    WHERE cart_id = $1 
    AND product_id IN (
      SELECT product_id FROM cart_items WHERE cart_id = $2
    )
  `,
    [userCart.id, guestCart.id]
  );

  // Insertamos los artículos del carrito invitado al carrito usuario
  const query = `
    INSERT INTO cart_items (cart_id, product_id, quantity)
    SELECT $1, product_id, quantity
    FROM cart_items
    WHERE cart_id = $2
    RETURNING *
  `;

  await db.query(query, [userCart.id, guestCart.id]);

  // Eliminamos el carrito de invitado
  await db.query(`DELETE FROM carts WHERE session_cart_id = $1`, [
    sessionCartId,
  ]);

  // Devolvemos el carrito actualizado del usuario
  return await getCart(userId);
}
