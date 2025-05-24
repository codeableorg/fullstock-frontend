import { Form, useNavigation } from "react-router";

import { Button, Container, Separator } from "@/components/ui";
import { type Product } from "@/models/product.model";
import { getProductById } from "@/services/product.server";

import NotFound from "../not-found";

import type { Route } from "./+types";

export async function loader({ request, params }: Route.LoaderArgs) {
  try {
    const product = await getProductById(request, parseInt(params.id));
    return { product };
  } catch {
    return {};
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const navigation = useNavigation();
  const cartLoading = navigation.state === "submitting";

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
            <Form method="post" action="/cart/add-item">
              <input
                type="hidden"
                name="redirectTo"
                value={`/products/${product.id}`}
              />
              <Button
                size="xl"
                className="w-full md:w-80"
                type="submit"
                name="productId"
                value={product.id}
                disabled={cartLoading}
              >
                {cartLoading ? "Agregando..." : "Agregar al Carrito"}
              </Button>
            </Form>
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
