import { useState } from "react";
import { Form, useNavigation } from "react-router";

import { Button, Container, Separator } from "@/components/ui";
import { type Product } from "@/models/product.model";
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
  const cartLoading = navigation.state === "submitting";
  const [selectedSize, setSelectedSize] = useState<string>("Medium");

  if (!product) {
    return <NotFound />;
  }

  const showSizeSelector = product.categoryId === 1 || product.categoryId === 3;

  const getAttributeValueId = () => { // AQUI TRAER EL AttributeValueId con el cambio de SEBAS
    if (
      !product.variantAttributeValues ||
      product.variantAttributeValues.length === 0
    ) {
      return undefined;
    }
    // Devuelve el attributeId de la posición 0
    return product.variantAttributeValues[0].id;
  };

  const getSizeOptions = () => {
    if (product.categoryId === 3) {
      return {
        label: "Dimensiones",
        options: [
          { value: "Small", label: "3x3 cm" },
          { value: "Medium", label: "5x5 cm" },
          { value: "Large", label: "10x10 cm" },
        ],
      };
    } else {
      return {
        label: "Talla",
        options: [
          { value: "Small", label: "Small" },
          { value: "Medium", label: "Medium" },
          { value: "Large", label: "Large" },
        ],
      };
    }
  };

  const sizeOptions = getSizeOptions();

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
              {showSizeSelector && (
                <span className="text-muted-foreground">
                  {" "}
                  (
                  {
                    sizeOptions.options.find(
                      (option) => option.value === selectedSize
                    )?.label
                  }
                  )
                </span>
              )}
            </h1>
            <p className="text-3xl leading-9 mb-6">S/{product.price}</p>
            <p className="text-sm leading-5 text-muted-foreground mb-10">
              {product.description}
            </p>

            {showSizeSelector && (
              <div className="mb-9">
                <p className="text-sm font-semibold text-accent-foreground mb-2">
                  {sizeOptions.label}
                </p>
                <div className="flex gap-2">
                  {sizeOptions.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        selectedSize === option.value ? "default" : "secondary"
                      }
                      size="lg"
                      onClick={() => setSelectedSize(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Form method="post" action="/cart/add-item">
              <input
                type="hidden"
                name="redirectTo"
                value={`/products/${product.id}`}
              />
              <input
                type="hidden"
                name="attributeValueId"
                value={getAttributeValueId() ?? ""}
              />
              <Button
                size="xl"
                className="w-full md:w-80"
                type="submit"
                // name="productId"
                // value={product.id}
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
