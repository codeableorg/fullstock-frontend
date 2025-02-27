import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";

import { Button, Container, Section } from "@/components/ui";
import { useCart } from "@/contexts/cart.context";

import styles from "./styles.module.css";

export default function Cart() {
  const { cart, changeQuantityItem, removeItem } = useCart();

  return (
    <Section>
      <Container className={styles.cart}>
        <h1 className={styles.cart__title}>Carrito de compras</h1>
        <div className={styles.cart__container}>
          {cart?.items?.map(({ product, quantity }) => (
            <div key={product.id} className={styles.cart__item}>
              <div className={styles["cart__item-image"]}>
                <img
                  src={product.imgSrc}
                  alt={product.title}
                  className={styles["cart__item-image-content"]}
                />
              </div>
              <div className={styles["cart__item-details"]}>
                <div className={styles["cart__item-header"]}>
                  <h2 className={styles["cart__item-title"]}>
                     {product.title} - {product.id} {/* Borra el ID */}
                  </h2>
                  <Button
                    size="sm-icon"
                    variant="outline"
                    onClick={() => removeItem(product.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <div className={styles["cart__item-footer"]}>
                  <p className={styles["cart__item-price"]}>
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <div className={styles["cart__item-quantity"]}>
                    <Button
                      onClick={() => changeQuantityItem(product, -1)}
                      variant="outline"
                      size="sm-icon"
                      disabled={quantity === 1}
                    >
                      <Minus />
                    </Button>
                    <span className={styles["cart__item-quantity-display"]}>
                      {quantity}
                    </span>
                    <Button
                      onClick={() => changeQuantityItem(product, 1)}
                      variant="outline"
                      size="sm-icon"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className={styles.cart__total}>
            <p>Total</p>
            <p>${(cart?.total || 0).toFixed(2)}</p>
          </div>
          <div className={styles.cart__action}>
            <Button size="lg" className={styles["cart__action-button"]} asChild>
              {cart?.items && cart.items.length > 0 ? (
                <Link to="/checkout">Continuar Compra</Link>
              ) : (
                <Link to="/">Ir a la tienda</Link>
              )}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
