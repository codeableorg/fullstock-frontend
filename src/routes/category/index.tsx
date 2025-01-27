import { useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import {
  isValidCategory,
  Product,
  ProductCategory,
} from "@/services/products/product.types";
import { ProductService } from "@/services/products/product.service";
import { PriceFilter } from "./components/price-filter";
import { ProductCard } from "./components/product-card";
import { Spinner } from "@/components/ui/spinner";
import { Container } from "@/components/ui/container";
import { capitalize } from "@/lib/utils";

const categoryDescription = {
  polos:
    "Polos exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
  stickers:
    "Stickers exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
  tazas:
    "Tazas exclusivas con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
};

export default function Category() {
  const { category } = useParams<{ category: ProductCategory }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    if (!isValidCategory(category)) return;

    setLoading(true);
    ProductService.getProductsByCategory(category)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category]);

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

  if (!isValidCategory(category)) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Invalid Category</h1>
        <p>"{category}" is not a valid category.</p>
      </div>
    );
  }

  if (loading) return <Spinner variant="main" />;

  return (
    <>
      <section className="py-10 border-b border-border">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{capitalize(category)}</h1>
            <p className="text-sm text-muted-foreground">
              {categoryDescription[category]}
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
