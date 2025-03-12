import { useCallback } from "react";
import { useParams, useSearchParams } from "react-router";

import { Container, ContainerLoader } from "@/components/ui";
import { useAsync } from "@/hooks/use-async";
import { isValidCategorySlug, type Category } from "@/models/category.model";
import { Product } from "@/models/product.model";
import { getCategoryBySlug } from "@/services/category.service";
import { getProductsByCategorySlug } from "@/services/product.service";

import NotFound from "../not-found";
import { PriceFilter } from "./components/price-filter";
import { ProductCard } from "./components/product-card";
import styles from "./styles.module.css";

export default function Category() {
  const { category: categorySlug } = useParams<{
    category: Category["slug"];
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const { data, loading } = useAsync(
    useCallback(
      () =>
        Promise.all([
          getCategoryBySlug(categorySlug!),
          getProductsByCategorySlug(categorySlug!),
        ]),
      [categorySlug]
    )
  );

  const [category, products] = data || [null, []];

  const handlePriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams);
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    setSearchParams(params);
  };

  if (!isValidCategorySlug(categorySlug) || !category) {
    return <NotFound />;
  }

  if (loading) return <ContainerLoader />;

  const filterProductsByPrice = (
    products: Product[],
    minPrice: string,
    maxPrice: string
  ): Product[] => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return products.filter(
      (product) => product.price >= min && product.price <= max
    );
  };

  const filteredProducts = loading
    ? []
    : filterProductsByPrice(products!, minPrice, maxPrice);

  return (
    <>
      <section className={styles.header}>
        <Container>
          <div className={styles.header__content}>
            <h1 className={styles.header__title}>{category.title}</h1>
            <p className={styles.header__description}>{category.description}</p>
          </div>
        </Container>
      </section>
      <section className={styles.products}>
        <Container>
          <div className={styles.products__layout}>
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              className={styles["products__price-filter"]}
            />
            <div className={styles.products__grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
