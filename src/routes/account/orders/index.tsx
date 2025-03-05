import { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { ContainerLoader } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { Order } from "@/models/order.model";
import { getOrdersByUser } from "@/services/order.service";

import styles from "./styles.module.css";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getOrdersByUser()
      .then((orders) =>
        setOrders(
          orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        )
      )
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) return <ContainerLoader />;

  return (
    <div>
      {orders.length > 0 ? (
        <div className={styles.orders}>
          {orders.map((order) => (
            <div key={order.id}>
              <div className={styles.orders__summary}>
                <dl className={styles["orders__summary-list"]}>
                  <div className={styles["orders__summary-item"]}>
                    <dt className={styles["orders__summary-term"]}>
                      Fecha del pedido
                    </dt>
                    <dd className={styles["orders__summary-description"]}>
                      <time dateTime={order.createdAt.toISOString()}>
                        {order.createdAt.toLocaleDateString()}
                      </time>
                    </dd>
                  </div>
                  <div
                    className={`${styles["orders__summary-item"]} ${styles["orders__summary-item--grow"]}`}
                  >
                    <dt className={styles["orders__summary-term"]}>
                      Número de orden
                    </dt>
                    <dd className={styles["orders__summary-description"]}>
                      {order.id}
                    </dd>
                  </div>
                  <div className={styles["orders__summary-item"]}>
                    <dt className={styles["orders__summary-term"]}>Total</dt>
                    <dd
                      className={`${styles["orders__summary-description"]} ${styles["orders__summary-description--total"]}`}
                    >
                      {order.items
                        .reduce(
                          (total, { product, quantity }) =>
                            total + product.price * quantity,
                          0
                        )
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                    </dd>
                  </div>
                </dl>
              </div>

              <table className={styles.orders__table}>
                <caption className={styles["orders__table-caption"]}>
                  Productos
                </caption>
                <thead className={styles["orders__table-head"]}>
                  <tr>
                    <th scope="col" className={styles["orders__table-header"]}>
                      Producto
                    </th>
                    <th
                      scope="col"
                      className={`${styles["orders__table-header"]} ${styles["orders__table-header--price"]}`}
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className={`${styles["orders__table-header"]} ${styles["orders__table-header--quantity"]}`}
                    >
                      Cantidad
                    </th>
                    <th
                      scope="col"
                      className={`${styles["orders__table-header"]} ${styles["orders__table-header--total"]}`}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className={styles["orders__table-body"]}>
                  {order.items.map(({ product, quantity }) => (
                    <tr key={product.id}>
                      <td className={styles["orders__table-cell"]}>
                        <div className={styles["orders__product"]}>
                          <div className={styles["orders__product-image"]}>
                            <img src={product.imgSrc} alt={product.title} />
                          </div>
                          <div>
                            <div className={styles["orders__product-title"]}>
                              {product.title}
                            </div>
                            <div
                              className={styles["orders__product-mobile-price"]}
                            >
                              {quantity} × ${product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className={`${styles["orders__table-cell"]} ${styles["orders__table-cell--price"]}`}
                      >
                        ${product.price.toFixed(2)}
                      </td>
                      <td
                        className={`${styles["orders__table-cell"]} ${styles["orders__table-cell--quantity"]}`}
                      >
                        {quantity}
                      </td>
                      <td
                        className={`${styles["orders__table-cell"]} ${styles["orders__table-cell--total"]}`}
                      >
                        ${(product.price * quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.orders__empty}>No hay pedidos realizados</p>
      )}
    </div>
  );
}
