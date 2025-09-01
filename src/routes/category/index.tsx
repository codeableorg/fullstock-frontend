import { redirect } from "react-router";

import { Container } from "@/components/ui";
import { isValidCategorySlug} from "@/models/category.model";
import type { Product } from "@/models/product.model";
import { getCategoryBySlug } from "@/services/category.service";
import { getProductsByCategorySlug } from "@/services/product.service";

import { PriceFilter } from "./components/price-filter";
import { ProductCard } from "./components/product-card";

import type { Route } from "./+types";

export type ProductWithDisplayPrice = Product & { displayedPrice: number };

export async function loader({ params, request }: Route.LoaderArgs) {
  const { category: categorySlug } = params;

  if (!isValidCategorySlug(categorySlug)) {
    return redirect("/not-found");
  }

  const url = new URL(request.url);
  const minPrice = url.searchParams.get("minPrice") || "";
  const maxPrice = url.searchParams.get("maxPrice") || "";

  try {
    const [category, products] = await Promise.all([
      getCategoryBySlug(categorySlug),
      getProductsByCategorySlug(categorySlug),
    ]);

    const filterProductsByPrice = (
      products: Product[],
      minPrice: string,
      maxPrice: string
    ): ProductWithDisplayPrice[] => {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    return products
        .map((product) => {
          if (product.variants && product.variants.length > 0) {
            const sortedVariants = [...product.variants].sort(
              (a, b) => a.price - b.price
            );

            const lowest = sortedVariants[0].price;
            const highest = sortedVariants[sortedVariants.length - 1].price;

            let selectedVariant = sortedVariants[0];

            if (min <= lowest && max >= highest) {
              // caso 1 -> rango incluye todos los precios
              selectedVariant = sortedVariants[0];
            } else {
              // caso 2 -> primer variant en rango
              const variantInRange = sortedVariants.find(
                (v) => v.price >= min && v.price <= max
              );
              if (variantInRange) {
                selectedVariant = variantInRange;
              }
            }

            return {
              ...product,
              displayedPrice: selectedVariant.price,
            };
          }

          // Si no tiene variants, usar price del producto
          return {
            ...product,
            displayedPrice: product.price,
          };
        })
  .filter((p) => p.displayedPrice >= min && p.displayedPrice <= max);
    };



    const filteredProducts = filterProductsByPrice(
      products,
      minPrice,
      maxPrice
    );

    return {
      category,
      products: filteredProducts,
      minPrice,
      maxPrice,
    };
  } catch (e) {
    throw new Response("Error loading category: " + e, { status: 500 });
  }
}

export default function Category({ loaderData }: Route.ComponentProps) {
  const { category, products, minPrice, maxPrice } = loaderData;

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
              className="w-full max-w-sm lg:max-w-xs"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
              {products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
