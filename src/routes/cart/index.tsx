import { Minus, Plus, Trash2 } from "lucide-react";
import { Form, Link } from "react-router";

import { Button, Container, Section } from "@/components/ui";
import { calculateTotal, getCart } from "@/lib/cart";
import { type Cart } from "@/models/cart.model";
import { getSession } from "@/session.server";

import type { Route } from "./+types";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  const cart = await getCart(userId, sessionCartId);

  const total = cart ? calculateTotal(cart.items) : 0;

  return { cart, total };
}

export default function Cart({ loaderData }: Route.ComponentProps) {
  const { cart, total } = loaderData;

  return (
    <Section>
      <Container className="max-w-xl">
        <h1 className="text-3xl leading-8 font-bold text-center mb-12">
          Carrito de compras
        </h1>
        <div className="border-solid border rounded-xl flex flex-col">
          {cart?.items?.map(({ product, quantity, id, attributeValueId }) => (
            <div key={product.id} className="flex gap-7 p-6 border-b">
              <div className="w-20 rounded-xl bg-muted">
                <img
                  src={product.imgSrc}
                  alt={product.alt || product.title}
                  className="w-full aspect-[2/3] object-contain"
                />
              </div>
              <div className="flex grow flex-col justify-between">
                <div className="flex gap-4 justify-between items-center">
                  <h2 className="text-sm">{product.title}</h2>
                  <Form method="post" action="/cart/remove-item">
                    <Button
                      size="sm-icon"
                      variant="outline"
                      name="itemId"
                      value={id}
                    >
                      <Trash2 />
                    </Button>
                  </Form>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                  <p className="text-sm font-medium">
                    ${product.price!.toFixed(2)}
                  </p>
                  <div className="flex gap-4 items-center">
                    <Form method="post" action="/cart/add-item">
                      <input type="hidden" name="quantity" value="-1" />
                      <Button
                        name="attributeValueId"
                        value={attributeValueId}
                        variant="outline"
                        size="sm-icon"
                        disabled={quantity === 1}
                      >
                        <Minus />
                      </Button>
                    </Form>
                    <span className="h-8 w-8 flex justify-center items-center border rounded-md py-2 px-4">
                      {quantity}
                    </span>
                    <Form method="post" action="/cart/add-item">
                      <Button
                        variant="outline"
                        size="sm-icon"
                        name="attributeValueId"
                        value={attributeValueId}
                      >
                        <Plus />
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between p-6 text-base font-medium border-b">
            <p>Total</p>
            <p>S/{total.toFixed(2)}</p>
          </div>
          <div className="p-6">
            <Button size="lg" className="w-full" asChild>
              {cart?.items && cart.items.length > 0 ? (
                <Link to="/checkout">Continuar Compra</Link>
              ) : (
                <Link to="/">Ir a la tienda</Link>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
