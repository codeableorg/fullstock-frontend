import { useEffect, useState } from "react";
import { Form, useNavigation, useSearchParams } from "react-router";

import { Button, Container, Separator } from "@/components/ui";
import { type Product } from "@/models/product.model";
import { getProductById } from "@/services/product.service";

import NotFound from "../not-found";

import type { Route } from "./+types";
const categoryStickerId =3
const categoryTazaId = 2
const initialVariantPosition = 1

const variantGroupLabel: { [key: number]: string } = {
  3: 'No aplica',
  1: 'Talla',
  2: 'Dimensiones'
}
const displayVariantSize: { [key: string]: string } = {
  'S': 'Small',
  'M': 'Medium',
  'L': 'Large'
}


export async function loader({ params }: Route.LoaderArgs) {
  try {
    const product = await getProductById(parseInt(params.id));
    return { product };
  } catch {
    return {};
  }
}

export default function Product({ loaderData }: Route.ComponentProps) {
const [searchParams] = useSearchParams();
const initialVariantId = searchParams.get("variantId") ? Number(searchParams.get("variantId")) : null;
  const { product } = loaderData;

  const getSizeOptions = () => {
    const options = product?.variantAttributeValues?.map((variantAttribute, index) => ({
      value: variantAttribute.id,
      label: product.categoryId === categoryStickerId ? `${variantAttribute.value} cm` : displayVariantSize[variantAttribute.value],
      price: variantAttribute.price,
      selected: index===initialVariantPosition?true:false
    }));
    if (product?.categoryId === categoryTazaId) {
      return {
        label: '',
        options: [{
          value: product?.variantAttributeValues?.[0].id,
          label: product?.variantAttributeValues?.[0].value,
          price: product?.variantAttributeValues?.[0].price,
          selected: true
        }]
      }
    }
    return {
      label: variantGroupLabel[product?.variantAttributeValues?.[0].attributeId as number],
      options: options || [],
    }
  };

  const sizeOptions = getSizeOptions();
  const navigation = useNavigation();
  const cartLoading = navigation.state === "submitting";
  const [data, setData] = useState(sizeOptions)
  const showSizeSelector = product?.categoryId === 1 || product?.categoryId === 3;
  const selectedDisplay = data.options.find((option) => option.selected === true);
  
  useEffect(() => {
    if (initialVariantId) {
      setData((prevData) => ({
        ...prevData,
        options: prevData.options.map((option) =>
          option.value === initialVariantId
            ? { ...option, selected: true }
            : { ...option, selected: false }
        ),
      }));
    }
  }, [initialVariantId]);

  const onSelectedVariant = (id: number) => {
    setData({
      ...data,
      options: data.options.map((v) => {
        if (v.value === id) {
          return ({
            ...v,
            selected: true
          })
        }
        return ({
          ...v,
          selected: false
        })
      })
    })
  }

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
              {showSizeSelector && (
                <span className="text-muted-foreground">
                  {" "}
                  (
                  {
                    data.options.find(
                      (option) => option.selected === true
                    )?.label
                  }
                  )
                </span>
              )}
            </h1>
            <p className="text-3xl leading-9 mb-6">S/ {selectedDisplay?.price}</p>
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
                        selectedDisplay?.value === option.value ? "default" : "secondary"
                      }
                      size="lg"
                      onClick={() => onSelectedVariant(option?.value||0)}
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
                value={`/products/${product.id}?variantId=${selectedDisplay?.value}`}
              />
              <input
                type="hidden"
                name="attributeValueId"
                value={selectedDisplay?.value||""}
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
