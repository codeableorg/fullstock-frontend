import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { Button, Container, ContainerLoader, Separator } from "@/components/ui";
import { useCart } from "@/contexts/cart.context";
import { type Product } from "@/models/product.model";
import { getProductById } from "@/services/product.service";

import styles from "./styles.module.css";
import NotFound from "../not-found";

export default function Product() {
  const { loading: cartLoading, addItem } = useCart();

  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(parseInt(id));
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

  if (!product) {
    return <NotFound />;
  }

  return (
    <>
      <section className={styles.product}>
        <Container className={styles.product__container}>
          <div className={styles.product__image}>
            <img
              src={product.imgSrc}
              alt={product.title}
              className={styles.product__image_content}
            />
          </div>
          <div className={styles.product__info}>
            <h1 className={styles.product__title}>{product.title}</h1>
            <p className={styles.product__price}>${product.price}</p>
            <p className={styles.product__description}>{product.description}</p>
            <Button
              size="xl"
              className={styles.product__button}
              onClick={() => addItem(product)}
              disabled={cartLoading}
            >
              {cartLoading ? "Agregando..." : "Agregar al Carrito"}
            </Button>
            <Separator className={styles.product__separator} />
            <div className={styles.product__features}>
              <h2 className={styles.product__features_title}>
                Características
              </h2>
              <ul className={styles.product__features_list}>
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
