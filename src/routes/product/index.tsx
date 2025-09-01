import { useState } from "react";
import { Form, useNavigation } from "react-router";

import { Button, Container, Separator } from "@/components/ui";
import { type ProductVariant } from "@/models/product.model";
import { getProductById } from "@/services/product.service";

import NotFound from "../not-found";

import type { Route } from "./+types";

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const product = await getProductById(parseInt(params.id));

    const url = new URL(request.url);
    const variantParam = url.searchParams.get("variant");

    return { product, variantParam };
  } catch {
    return {};
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, variantParam } = loaderData;
  const navigation = useNavigation();
  const cartLoading = navigation.state === "submitting";

  const initialVariant =
    product?.variants?.find((v) => variantParam && v.value === variantParam) ??
    product?.variants?.[0] ??
    null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    initialVariant
  );

  const [hoveredVariant, setHoveredVariant] = useState<ProductVariant | null>(
    null
  );

  if (!product) return <NotFound />;

  const variantLabel =
    product.categoryId === 1
      ? "Talla"
      : product.categoryId === 3
      ? "Tamaño"
      : "";

  const displayedPrice =
    hoveredVariant?.price ?? selectedVariant?.price ?? product.price;

  return (
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
          <h1 className="text-3xl leading-9 font-bold mb-3">{product.title}</h1>
          <p className="text-3xl leading-9 mb-6">S/{displayedPrice}</p>
          <p className="text-sm leading-5 text-muted-foreground mb-6">
            {product.description}
          </p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <span className="text-sm font-semibold text-accent-foreground mr-2">
                {variantLabel}:
              </span>
              <div className="flex flex-wrap gap-3 mt-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow"
                          : "bg-muted text-muted-foreground border-border hover:bg-primary/10 hover:border-primary"
                      } focus:outline-none focus:ring-2 focus:ring-primary`}
                      onClick={() => setSelectedVariant(variant)}
                      onMouseEnter={() => setHoveredVariant(variant)}
                      onMouseLeave={() => setHoveredVariant(null)}
                    >
                      {variant.value}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Form method="post" action="/cart/add-item">
            <input
              type="hidden"
              name="redirectTo"
              value={`/products/${product.id}?variant=${encodeURIComponent(
                selectedVariant?.value ?? ""
              )}`}
            />
            <input
              type="hidden"
              name="productVariantId"
              value={selectedVariant?.id ?? ""}
            />
            <Button
              size="xl"
              className="w-full md:w-80 mt-4"
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
  );
}
