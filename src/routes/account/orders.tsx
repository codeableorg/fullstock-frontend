import { useEffect, useState } from "react";
import { Navigate } from "react-router";

import { ContainerLoader } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { Order } from "@/models/order.model";
import { getOrdersByUser } from "@/services/order.service";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    getOrdersByUser(user.id)
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
        <div className="space-y-20">
          {orders.map((order) => (
            <div key={order.id}>
              <div className="rounded-lg bg-muted px-4 py-6">
                <dl className="flex w-full flex-col gap-4 sm:flex-row sm:gap-8">
                  <div className="flex-shrink-0">
                    <dt className="font-medium text-accent-foreground">
                      Date placed
                    </dt>
                    <dd className="sm:mt-1">
                      <time dateTime={order.createdAt.toISOString()}>
                        {order.createdAt.toLocaleDateString()}
                      </time>
                    </dd>
                  </div>
                  <div className="flex-grow">
                    <dt className="font-medium text-accent-foreground">
                      Order number
                    </dt>
                    <dd className="sm:mt-1">{order.id}</dd>
                  </div>
                  <div className="">
                    <dt className="font-medium text-accent-foreground">
                      Total
                    </dt>
                    <dd className="font-medium text-foreground sm:mt-1">{}</dd>
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
                  </div>
                </dl>
              </div>

              <table className="mt-4 w-full text-muted-foreground sm:mt-6">
                <caption className="sr-only">Products</caption>
                <thead className="sr-only text-left text-sm text-muted-foreground sm:not-sr-only">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="hidden py-3 pr-8 font-normal sm:table-cell"
                    >
                      Quantity
                    </th>
                    <th scope="col" className="w-0 py-3 text-right font-normal">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border border-b border-border text-sm sm:border-t">
                  {order.items.map(({ product, quantity }) => (
                    <tr key={product.id}>
                      <td className="py-6 pr-8">
                        <div className="flex items-center gap-2">
                          {/* <img
                            alt={product.title}
                            src={product.imgSrc}
                            className="mr-6 size-16 rounded object-cover"
                          /> */}
                          <div className="w-16 rounded-xl bg-muted">
                            <img
                              src={product.imgSrc}
                              alt={product.title}
                              className="w-full aspect-square object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {product.title}
                            </div>
                            <div className="mt-1 sm:hidden">
                              {quantity} × ${product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        {quantity}
                      </td>
                      <td className="whitespace-nowrap py-6 text-right font-medium text-foreground">
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
        <p className="text-muted-foreground">No hay pedidos realizados</p>
      )}
    </div>
  );
}
