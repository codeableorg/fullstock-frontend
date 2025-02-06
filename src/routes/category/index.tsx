import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import { Container, ContainerLoader } from "@/components/ui";
import { isValidCategorySlug, type Category } from "@/models/category.model";
import { Product } from "@/models/product.model";
import { getCategoryBySlug } from "@/services/category.service";
import { getProductsByCategorySlug } from "@/services/product.service";

import NotFound from "../not-found";
import { PriceFilter } from "./components/price-filter";
import { ProductCard } from "./components/product-card";

export default function Category() {
  const { category: categorySlug } = useParams<{
    category: Category["slug"];
  }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    if (!isValidCategorySlug(categorySlug)) return;

    Promise.all([
      getCategoryBySlug(categorySlug),
      getProductsByCategorySlug(categorySlug),
    ])
      .then(([categoryData, productsData]) => {
        setCategory(categoryData);
        setProducts(productsData);
      })
      .finally(() => setLoading(false));
  }, [categorySlug]);

  const handlePriceChange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams);
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    setSearchParams(params);
  };

  const filteredProducts = products.filter((product) => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    return product.price >= min && product.price <= max;
  });

  if (!isValidCategorySlug(categorySlug)) {
    return <NotFound />;
  }

  if (!category || loading) return <ContainerLoader />;

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
          <div className="flex gap-8 flex-col lg:flex-row">
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              className="w-full max-w-96 lg:max-w-64"
            />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 grow">
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
