import * as db from "@/db";
import { type Order } from "@/models/order.model";
import {
  type OrderItemInput,
  type OrderDetails as ShippingDetails,
} from "@/models/order.model";

export async function createOrderWithItems(
  userId: number | undefined,
  items: OrderItemInput[],
  shippingDetails: ShippingDetails,
  totalAmount: number
): Promise<Order | null> {
  // Use a transaction to ensure data consistency
  const client = await db.getClient();

  try {
    await client.query("BEGIN");

    // Create order
    const orderResult = await client.query<Order>(
      `INSERT INTO orders (
        user_id, total_amount, email, first_name, last_name, company,
        address, city, country, region, zip, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId,
        totalAmount,
        shippingDetails.email,
        shippingDetails.firstName,
        shippingDetails.lastName,
        shippingDetails.company,
        shippingDetails.address,
        shippingDetails.city,
        shippingDetails.country,
        shippingDetails.region,
        shippingDetails.zip,
        shippingDetails.phone,
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (
          order_id, product_id, quantity, title, price, img_src
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.productId,
          item.quantity,
          item.title,
          item.price,
          item.imgSrc,
        ]
      );
    }

    await client.query("COMMIT");
    return getOrderById(order.id); // Get complete order with items
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const query = `
    SELECT 
      o.*,
      COALESCE(
        json_agg(
          CASE WHEN oi.id IS NOT NULL THEN
            json_build_object(
              'id', oi.id,
              'order_id', oi.order_id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'title', oi.title,
              'price', oi.price,
              'img_src', oi.img_src,
              'created_at', oi.created_at,
              'updated_at', oi.updated_at
            )
          ELSE NULL END
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return await db.query(query, [userId]);
}

async function getOrderById(orderId: number): Promise<Order | null> {
  const query = `
    SELECT 
      o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'productId', oi.product_id,
          'quantity', oi.quantity,
          'title', oi.title,
          'price', oi.price,
          'imgSrc', oi.img_src
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = $1
    GROUP BY o.id
  `;

  return await db.queryOne<Order>(query, [orderId]);
}
