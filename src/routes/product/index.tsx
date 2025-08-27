import { useEffect, useState } from "react";
import { Form, useNavigation, useSearchParams } from "react-router";

import { VariantSelector } from "@/components/product/VariantSelector";
import { Button, Container, Separator } from "@/components/ui";
import { capitalize } from "@/lib/utils";
import { getProductById } from "@/services/product.service";

import NotFound from "../not-found";

import type { Route } from "./+types";

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
  const [searchParams] = useSearchParams();
  const cartLoading = navigation.state === "submitting";

  const getInitialSize = () => {
    const isValidSize = (size: string | null) => {
      return size === "small" || size === "medium" || size === "large";
    };
    const sizeFromUrl = searchParams.get("size");
    const availableSizes = product?.variants?.map((v) => v.size) || [];
    if (isValidSize(sizeFromUrl) && availableSizes.includes(sizeFromUrl)) {
    return sizeFromUrl;
  }
    return product?.variants?.[0]?.size ?? "";
  };

  const getInitialMeasure = () => {
    const isValidMeasure = (measure: string | null) => {
      return measure === "3*3" || measure === "5*5" || measure === "10*10";
    };
    const measureFromUrl = searchParams.get("measure");
    const availableMeasures =
      product?.stickersVariants?.map((v) => v.measure) || [];
    if (isValidMeasure(measureFromUrl) && availableMeasures.includes(measureFromUrl)) {
      return measureFromUrl;
    }
    return product?.stickersVariants?.[0]?.measure ?? "";
  };

  const [selectedSize, setSelectedSize] = useState(getInitialSize);
  const [selectedMeasure, setSelectedMeasure] = useState(getInitialMeasure);

  useEffect(() => {
    setSelectedSize(getInitialSize);
    setSelectedMeasure(getInitialMeasure);
  }, [searchParams, product?.id]);

  if (!product) {
    return <NotFound />;
  }

  let displayedPrice = product.price;

  if (selectedMeasure) {
    displayedPrice = product.stickersVariants?.find(v => v.measure === selectedMeasure)?.price || product.price;
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
            <p className="text-3xl leading-9 mb-6">S/{displayedPrice}</p>
            <p className="text-sm leading-5 text-muted-foreground mb-10">
              {product.description}
            </p>
            <Form method="post" action="/cart/add-item">
              <input
                type="hidden"
                name="redirectTo"
                value={`/products/${product.id}`}
              />
              {/* Botones de talla si hay variantes */}
              {product.variants && product.variants.length > 0 && (
                <VariantSelector
                  label="Talla"
                  name="size"
                  options={product.variants.map(variant => ({
                    id: variant.id,
                    label: capitalize(variant.size),
                    value: variant.size ,
                  }))}
                  selectedValue={selectedSize}
                  onSelect={setSelectedSize}
                />
              )}
              {/* Botones de medida si hay variantes de stickers */}
              {product.stickersVariants && product.stickersVariants.length > 0 && (
                <VariantSelector
                  label="Medida"
                  name="measure"
                  options={product.stickersVariants.map(variant => ({
                    id: variant.id,
                    label: variant.measure,
                    value: variant.measure ,
                  }))}
                  selectedValue={selectedMeasure}
                  onSelect={setSelectedMeasure}
                />
              )}
              {/* Botón de agregar al carrito */}
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