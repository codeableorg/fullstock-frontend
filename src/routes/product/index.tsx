import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { ContainerLoader } from "@/components/ui/container-loader";
import { useCart } from "@/providers/cart";
import { getProductById } from "@/services/products/product.service";
import { type Product } from "@/services/products/product.types";

export default function Product() {
  const { addItem, state } = useCart();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <ContainerLoader />;

  if (!product)
    return <div className="text-center mt-10">Product not found.</div>;

  return (
    <>
      <section className="py-12">
        <Container className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="bg-muted rounded-xl min-w-[min(100%,448px)] self-center basis-0 grow max-w-xl md:min-w-fit md:self-start">
            <img
              src={product.imgSrc}
              alt={product.title}
              className="object-cover w-full aspect-square"
            />
          </div>
          <div className="grow basis-0">
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            <p className="text-3xl mb-6">${product.price}</p>
            <p className="text-sm text-muted-foreground mb-10">
              {product.description}
            </p>
            <Button
              size="xl"
              className="w-full md:w-80"
              onClick={() => addItem(product)}
              disabled={state.loading}
            >
              {state.loading ? "Agregando..." : "Agregar al Carrito"}
            </Button>
            <Separator className="my-6" />
            <div>
              <h2 className="text-sm font-semibold text-accent-foreground mb-6">
                Características
              </h2>
              <ul className="list-disc pl-4 text-sm text-muted-foreground">
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
