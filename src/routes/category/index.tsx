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
//import styles from "./styles.module.css";

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
      <section className="py-10 border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </Container>
      </section>
      <section className="py-10">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              className="w-full max-w-sm lg:max-w-xs"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
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
