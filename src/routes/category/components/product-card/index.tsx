import { Link } from "react-router";

import { Product } from "@/models/product.model";

import styles from "./styles.module.css";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className={styles["product-card"]}>
      <div className={styles["product-card__container"]}>
        <div className={styles["product-card__image-container"]}>
          <img
            src={product.imgSrc}
            alt={product.title}
            className={styles["product-card__image"]}
          />
        </div>
        <div className={styles["product-card__content"]}>
          <h2 className={styles["product-card__title"]}>{product.title}</h2>
          <p className={styles["product-card__description"]}>
            {product.description}
          </p>
          <p className={styles["product-card__price"]}>${product.price}</p>
        </div>
        {product.isOnSale && (
          <span className={styles["product-card__sale-badge"]}>🚀 Oferta</span>
        )}
      </div>
    </Link>
  );
}
