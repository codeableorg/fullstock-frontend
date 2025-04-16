import { useCallback } from "react";
import { useOutletContext, useParams, useSubmit } from "react-router";

import { Button, Container, ContainerLoader, Separator } from "@/components/ui";
import { useCart } from "@/contexts/cart.context";
import { useAsync } from "@/hooks/use-async";
import { getProductById } from "@/services/product.service";

import NotFound from "../not-found";
import type { Product } from "@/models/product.model";

export default function Product() {
  const { loading: cartLoading, changeItemQuantity } = useCart();

  const { submit } = useOutletContext();

  const { id } = useParams<{ id: string }>();

  const fetchProductById = useCallback(
    () => getProductById(parseInt(id!)),
    [id]
  );

  const handleClick = (product: Product) => {
    const formData = new FormData();
    formData.set("product", JSON.stringify(product));
    submit(formData, { method: "post" });
  };

  const { data: product, loading } = useAsync(fetchProductById);

  if (loading) return <ContainerLoader />;

  if (!product) {
    return <NotFound />;
  }

  return (
    <>
      <section className="py-12">
        <Container className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="bg-muted rounded-xl min-w-[min(100%,28rem)] self-center flex-grow max-w-xl md:min-w-fit md:self-start">
            <img
              src={product.imgSrc}
              alt={product.title}
              className="w-full aspect-square object-contain"
            />
          </div>
          <div className="flex-grow flex-basis-0">
            <h1 className="text-3xl leading-9 font-bold mb-3">
              {product.title}
            </h1>
            <p className="text-3xl leading-9 mb-6">${product.price}</p>
            <p className="text-sm leading-5 text-muted-foreground mb-10">
              {product.description}
            </p>

            <Button
              size="xl"
              className="w-full md:w-80"
              name="intent"
              value="changeItemQuantity"
              onClick={() => handleClick(product)}
              disabled={cartLoading}
            >
              {cartLoading ? "Agregando..." : "Agregar al Carrito"}
            </Button>
            <Separator className="my-6" />
            <div>
              <h2 className="text-sm font-semibold text-accent-foreground mb-6">
                Características
              </h2>
              <ul className="list-disc pl-4 text-sm leading-5 text-muted-foreground">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
