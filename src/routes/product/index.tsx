import { Form, useNavigation } from "react-router";

import { Button, Container, Separator } from "@/components/ui";
import { cn } from "@/lib/utils";
import { type Product } from "@/models/product.model";
import { getProductById } from "@/services/product.service";

import NotFound from "../not-found";

import type { Route } from "./+types";
import { useEffect, useState } from "react";
import { getCategoryWithVariants } from "@/services/category.service";

interface CategoryVariant {
  id: number;
  value: string;
  label: string;
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const product = await getProductById(parseInt(params.id));
    const categoryWithVariants = product.categoryId
      ? await getCategoryWithVariants(product.categoryId)
      : null;
    return { product, categoryWithVariants };
  } catch {
    return {};
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, categoryWithVariants } = loaderData;
  const navigation = useNavigation();
  const cartLoading = navigation.state === "submitting";

  // Estado simple para variantes
  const [variants, setVariants] = useState<CategoryVariant[]>([]);
  const [selectedVariant, setSelectedVariant] =
    useState<CategoryVariant | null>(null);

  // Cargar variantes si la categoría las tiene
  useEffect(() => {
    if (
      !categoryWithVariants?.hasVariants ||
      !categoryWithVariants.categoryVariants.length
    ) {
      setVariants([]);
      setSelectedVariant(null);
      return;
    }

    const mappedVariants: CategoryVariant[] =
      categoryWithVariants.categoryVariants.map((variant) => ({
        id: variant.id,
        value: variant.value,
        label: variant.label,
      }));

    setVariants(mappedVariants);
    setSelectedVariant(mappedVariants[0] || null);
  }, [categoryWithVariants?.id, categoryWithVariants?.hasVariants]);

  if (!product) {
    return <NotFound />;
  }

  const hasVariants = categoryWithVariants?.hasVariants && variants.length > 0;

  // Helper para obtener el label de la variante
  const getVariantLabel = () => {
    if (product.categoryId === 1) return "Talla";
    if (product.categoryId === 3) return "Tamaño";
    return "Opciones";
  };

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
            <p className="text-3xl leading-9 mb-6">S/{product.price}</p>
            <p className="text-sm leading-5 text-muted-foreground mb-10">
              {product.description}
            </p>

            {/* Toggle Button Group para Variantes - Implementación directa */}
            {hasVariants && (
              <div className="mb-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    {getVariantLabel()}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((variant) => (
                      <Button
                        key={variant.id}
                        type="button"
                        variant={
                          selectedVariant?.id === variant.id
                            ? "default"
                            : "outline"
                        }
                        size="default"
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "h-10 px-4 transition-all duration-200",
                          selectedVariant?.id === variant.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-muted"
                        )}
                      >
                        {variant.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Form method="post" action="/cart/add-item">
              <input
                type="hidden"
                name="redirectTo"
                value={`/products/${product.id}`}
              />
              <input type="hidden" name="productId" value={product.id} />
              {selectedVariant && (
                <input
                  type="hidden"
                  name="categoryVariantId"
                  value={selectedVariant.id}
                />
              )}
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
