import { redirect, useLoaderData } from "react-router";
import { Order } from "@/models/order.model";
import { getOrdersByUser } from "@/services/order.service";
import { getCurrentUser } from "@/services/auth.service";
import { removeToken } from "@/lib/utils";

type LoaderData = { data?: Order[] };

export async function loader(): Promise<LoaderData> {
  try {
    const user = await getCurrentUser();
    const orders = await getOrdersByUser();
    if (!user) throw redirect("/login");

    orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return { data: orders };
  } catch {
    removeToken();
    return {};
  }
}

export default function Orders() {
  const { data: orders } = useLoaderData() as LoaderData;

  return (
    <div>
      {orders!.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orders!.map((order) => (
            <div key={order.id}>
              <div className="rounded-lg bg-muted py-4 px-6">
                <dl className="flex flex-col gap-4 w-full sm:flex-row">
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
                    <th scope="col" className="py-3 pl-16">
                      Producto
                    </th>
                    <th
                      scope="col"
                      className="py-3 pr-8 text-center hidden sm:table-cell sm:w-1/5"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="py-3 pr-8 text-center hidden sm:table-cell sm:w-1/5"
                    >
                      Cantidad
                    </th>
                    <th scope="col" className="py-3 pr-8 text-center">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="border-t border-b border-border">
                  {order.items.map((item) => (
                    <tr key={item.productId}>
                      <td className="py-6 pl-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 rounded-xl bg-muted">
                            <img src={item.imgSrc} alt={item.title} />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {item.title}
                            </div>
                            <div className="mt-1 sm:hidden">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 pr-8 text-center hidden sm:table-cell">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="py-6 pr-8 text-center hidden sm:table-cell">
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
