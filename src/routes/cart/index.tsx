import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useCart } from "@/contexts/cart.context";

export default function Cart() {
  const { state, updateQuantity, removeItem } = useCart();

  return (
    <Section>
      <Container className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12">
          Carrito de compras
        </h1>
        <div className="divide-y divide-border border border-border rounded-xl">
          {state.items?.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-6 p-6">
              <div className="w-20 rounded-xl bg-muted">
                <img
                  src={product.imgSrc}
                  alt={product.title}
                  className="w-full aspect-[2/3] object-contain"
                />
              </div>
              <div className="grow flex flex-col justify-between">
                <div className="flex gap-4 justify-between items-center">
                  <h2 className="text-sm">{product.title}</h2>
                  <Button
                    size="sm-icon"
                    variant="outline"
                    onClick={() => removeItem(product.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm font-medium">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex gap-4 items-center">
                    <Button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      variant="outline"
                      size="sm-icon"
                      disabled={quantity === 1}
                    >
                      <Minus />
                    </Button>
                    <span className="h-8 w-8 flex justify-center items-center border border-border rounded-md px-4 py-2">
                      {quantity}
                    </span>
                    <Button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      variant="outline"
                      size="sm-icon"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-between p-6 text-base font-medium">
            <p>Total</p>
            <p>${state.total.toFixed(2)}</p>
          </div>
          <div className="p-6">
            <Button size="lg" className="w-full" asChild>
              {state.items && state.items.length > 0 ? (
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
