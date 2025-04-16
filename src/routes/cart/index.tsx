import { Minus, Plus, Trash2 } from "lucide-react";
import { Link, useOutletContext } from "react-router";

import { Button, Container, Section } from "@/components/ui";
//import { useCart } from "@/contexts/cart.context";
import { User } from "@/models/user.model";
import type { Cart } from "@/models/cart.model";

type LoaderData = { user?: Omit<User, "password">; cart: Cart | null };

export default function Cart() {
  //const { cart, changeItemQuantity, removeItem } = useCart();

  const { cart } = useOutletContext() as LoaderData;

  return (
    <Section>
      <Container className="max-w-xl">
        <h1 className="text-3xl leading-8 font-bold text-center mb-12">
          Carrito de compras
        </h1>
        <div className="border-solid border rounded-xl flex flex-col">
          {cart?.items?.map(({ product, quantity, id }) => (
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
                  <Button
                    size="sm-icon"
                    variant="outline"
                    name="intent"
                    value="removeItem"
                    onClick={() => removeItem(id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                  <p className="text-sm font-medium">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex gap-4 items-center">
                    <Button
                      onClick={() => changeItemQuantity(product, -1)}
                      variant="outline"
                      size="sm-icon"
                      name="intent"
                      value="changeItemQuantity"
                      disabled={quantity === 1}
                    >
                      <Minus />
                    </Button>
                    <span className="h-8 w-8 flex justify-center items-center border rounded-md py-2 px-4">
                      {quantity}
                    </span>
                    <Button
                      onClick={() => changeItemQuantity(product, 1)}
                      variant="outline"
                      name="intent"
                      value="changeItemQuantity"
                      size="sm-icon"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between p-6 text-base font-medium border-b">
            <p>Total</p>
            <p>${(cart?.total || 0).toFixed(2)}</p>
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
