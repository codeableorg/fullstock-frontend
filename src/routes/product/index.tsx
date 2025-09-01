import { useState, useEffect } from "react";
import { Form, useNavigation, useSearchParams } from "react-router";

import { Button, Container, Separator } from "@/components/ui";
import { type Product } from "@/models/product.model";
import { getProductById } from "@/services/product.service";

import NotFound from "../not-found";

import type { Route } from "./+types";

const shirtId = 1;
const stickerId = 3;

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const product = await getProductById(parseInt(params.id));
    return { product };
  } catch {
    return {};
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const navigation = useNavigation();
  const cartLoading = navigation.state === "submitting";
  
  const [searchParams] = useSearchParams();
  const initialVariantId = searchParams.get("variantId") ? Number(searchParams.get("variantId")) : null;

  // Estados para manejar variantes
  const [selectedVariant, setSelectedVariant] = useState<number | null>(initialVariantId);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Verificar si el producto tiene variantes
  const hasVariants = product?.variantAttributeValues && product.variantAttributeValues.length > 0;
  
  // Verificar si debe mostrar selectores (solo polos y stickers)
  const shouldShowVariants = hasVariants && (product?.categoryId === shirtId || product?.categoryId === stickerId);
  
  // Agrupar variantes por atributo
  const variantGroups = shouldShowVariants 
    ? product.variantAttributeValues!.reduce((groups, variant) => {
        const attributeName = variant!.variantAttribute!.name;
        if (!groups[attributeName]) {
          groups[attributeName] = [];
        }
        groups[attributeName].push(variant);
        return groups;
      }, {} as Record<string, typeof product.variantAttributeValues>)
    : {};

  useEffect(() => {
    if (!product) return;
    
    if (hasVariants && product.variantAttributeValues) {
        const firstVariant = product.variantAttributeValues[selectedVariant ? product.variantAttributeValues.findIndex(v => v.id === selectedVariant) : 0];
        setSelectedVariant(firstVariant.id);
        setCurrentPrice(Number(firstVariant.price));
    } else {
      setCurrentPrice(Number(product.price || 0));
    }
  }, [product, hasVariants, selectedVariant]);

  // Funciones después de los hooks
  const handleVariantChange = (variantId: number) => {
    setSelectedVariant(variantId);
    const variant = product?.variantAttributeValues?.find(v => v.id === variantId);
    if (variant) {
      setCurrentPrice(Number(variant.price));
    }
  };

  if (!product) {
    return <NotFound />;
  }

  return (
    <>
    <pre>{JSON.stringify(variantGroups, null, 2)}</pre>
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
            
            {/* Precio dinámico */}
            <p className="text-3xl leading-9 mb-6">
              S/{currentPrice.toFixed(2)}
            </p>
            
            <p className="text-sm leading-5 text-muted-foreground mb-10">
              {product.description}
            </p>

            {/* Selectores de variantes dinámicos - solo para polos y stickers */}
            {shouldShowVariants && (
              <>
                {Object.entries(variantGroups).map(([attributeName, variants]) => (
                  <div key={attributeName} className="mb-9">
                    <p className="text-sm font-semibold text-accent-foreground mb-2">
                      {attributeName.charAt(0).toUpperCase() + attributeName.slice(1)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variants!.map((variant) => (
                        <Button
                          key={variant.id}
                          variant={selectedVariant === variant.id ? "default" : "secondary"}
                          size="lg"
                          className="flex-1 min-w-[80px] sm:min-w-[100px] md:flex-none md:w-[70px]"
                          onClick={() => handleVariantChange(variant.id)}
                        >
                          {variant.value}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Formulario actualizado para enviar variante seleccionada */}
            <Form method="post" action="/cart/add-item">
              <input
                type="hidden"
                name="redirectTo"
                value={`/products/${product.id}?variantId=${selectedVariant}`}
              />
              <input
                type="hidden"
                name="attributeValueId"
                value={selectedVariant!}
              />
              {/* Enviar la variante seleccionada si existe y debe mostrar variantes */}
              {shouldShowVariants && selectedVariant && (
                <input
                  type="hidden"
                  name="variantId"
                  value={selectedVariant}
                />
              )}
              <Button
                size="xl"
                className="w-full md:w-80"
                type="submit"
                disabled={cartLoading || (shouldShowVariants && !selectedVariant)}
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