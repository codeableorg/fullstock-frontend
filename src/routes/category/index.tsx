import { redirect } from "react-router";

import { Container } from "@/components/ui";
import { isValidCategorySlug, type Category } from "@/models/category.model";
import { getCategoryBySlug } from "@/services/category.service";
import { filterByMinMaxPrice } from "@/services/product.service";

import { PriceFilter } from "./components/price-filter";
import { ProductCard } from "./components/product-card";

import type { Route } from "./+types";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { category: categorySlug } = params;

  if (!isValidCategorySlug(categorySlug)) {
    return redirect("/not-found");
  }

  const url = new URL(request.url);
  const minPrice = url.searchParams.get("minPrice");
  const minValue = minPrice ? parseFloat(minPrice) : undefined;
  const maxPrice = url.searchParams.get("maxPrice");
  const maxValue = maxPrice ? parseFloat(maxPrice) : undefined;


  try {
    const [category] = await Promise.all([
      getCategoryBySlug(categorySlug),
    ]);
    const finalProducts = await filterByMinMaxPrice(categorySlug, minValue, maxValue);

    return {
      category,
      products: finalProducts,
      minPrice: minValue,
      maxPrice: maxValue,
      finalProducts
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
