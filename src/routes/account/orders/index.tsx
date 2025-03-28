import { Navigate } from "react-router";

import { ContainerLoader } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { useAsync } from "@/hooks/use-async";
import { Order } from "@/models/order.model";
import { getOrdersByUser } from "@/services/order.service";

export default function Orders() {
  const { user } = useAuth();
  const { data, loading } = useAsync<Order[]>(getOrdersByUser);
  let orders: Order[] = [];

  if (data) {
    orders = data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) return <ContainerLoader />;

  return (
    <div>
      {orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id}>
              <div className="rounded-lg bg-muted py-4 px-6">
                <dl className="flex justify-between text-center gap-4 w-full">
                  <div className="flex-shrink-0">
                    <dt className="font-medium text-accent-foreground">
                      Fecha del pedido
                    </dt>
                    <dd className="mt-1">
                      <time dateTime={order.createdAt.toISOString()}>
                        {order.createdAt.toLocaleDateString()}
                      </time>
                    </dd>
                  </div>
                  <div className="flex-shrink-0 flex-grow">
                    <dt className="font-medium text-accent-foreground">
                      Número de orden
                    </dt>
                    <dd className="mt-1">{order.id}</dd>
                  </div>
                  <div className="flex-shrink-0">
                    <dt className="font-medium text-accent-foreground">
                      Total
                    </dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {order.totalAmount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              <table className="w-full mt-4 text-sm text-muted-foreground">
                <caption className="sr-only">Productos</caption>
                <thead className="not-sr-only text-left">
                  <tr>
                    <th scope="col" className="py-3 pl-16">Producto</th>
                    <th scope="col" className="py-3 pr-8 w-1/5 text-center">Precio</th>
                    <th scope="col" className="py-3 pr-8 w-1/5 text-center">Cantidad</th>
                    <th scope="col" className="py-3 pr-8 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="border-t border-b border-border">
                  {order.items.map((item) => (
                    <tr key={item.productId}> 
                      <td className="py-6 pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 rounded-xl bg-muted">
                            <img src={item.imgSrc} alt={item.title}/>
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {item.title}
                            </div>
                            <div className="mt-1">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell text-center">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell text-center">
                        {item.quantity}
                      </td>
                      <td className="py-6 pr-8 whitespace-nowrap text-center font-medium text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
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
