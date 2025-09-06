import { redirect } from "react-router";

import { Container } from "@/components/ui";
import { isValidCategorySlug, type Category } from "@/models/category.model";
import type { Product } from "@/models/product.model";
import { calculateFinalPrice } from "@/services/cart.service";
import {
  getCategoryBySlug,
  getCategoryWithVariants,
} from "@/services/category.service";
import { getProductsByCategorySlug } from "@/services/product.service";

import { PriceFilter } from "./components/price-filter";
import { ProductCard } from "./components/product-card";

import type { Route } from "./+types";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { category: categorySlug } = params;

  if (!isValidCategorySlug(categorySlug)) {
    return redirect("/not-found");
  }

  const url = new URL(request.url);
  const minPrice = url.searchParams.get("minPrice") || "";
  const maxPrice = url.searchParams.get("maxPrice") || "";
  const selectedVariants = url.searchParams.getAll("variants") || [];

  try {
    const [category, products] = await Promise.all([
      getCategoryBySlug(categorySlug),
      getProductsByCategorySlug(categorySlug),
    ]);

    const categoryWithVariants = await getCategoryWithVariants(category.id);
    const categoryVariants = categoryWithVariants?.categoryVariants || [];

    const productxVariants = await Promise.all(
      products.flatMap(async (product) => {
        if (categoryVariants.length === 0) {
          // Si no hay variantes, solo precio base
          return [
            {
              ...product,
              categoryVariant: null,
              finalPrice: product.price,
              minPricexProduct: product.price,
              maxPricexProduct: product.price,
            },
          ];
        }

        // Crear un producto por cada variante
        const productVariants = await Promise.all(
          categoryVariants.map(async (variant) => {
            const finalPrice = await calculateFinalPrice(
              product.id,
              variant.id
            );
            return {
              ...product,
              categoryVariant: variant,
              finalPrice,
              minPricexProduct: finalPrice,
              maxPricexProduct: finalPrice,
            };
          })
        );

        // Calcular rango de precios por producto
        const prices = productVariants.map((pv) => pv.finalPrice);
        const minPricexProduct = Math.min(...prices);
        const maxPricexProduct = Math.max(...prices);

        return productVariants.map((pv) => ({
          ...pv,
          minPricexProduct,
          maxPricexProduct,
        }));
      })
    );

    // ✅ ACTUALIZADO: Filtrar por precio y variantes
    const filteredProducts = filterProductsByPriceAndVariants(
      productxVariants.flat(),
      minPrice,
      maxPrice,
      selectedVariants
    );

    // ✅ NUEVO: Agrupar productos únicos con sus rangos de precio
    const uniqueProducts = products
      .map((product) => {
        const productVariants = filteredProducts.filter(
          (pv) => pv.id === product.id
        );
        if (productVariants.length === 0) return null;

        const prices = productVariants.map((pv) => pv.finalPrice);
        const minPricexProduct = Math.min(...prices);
        const maxPricexProduct = Math.max(...prices);

        return {
          ...product,
          minPricexProduct,
          maxPricexProduct,
          hasVariants: categoryVariants.length > 0,
          categoryVariants: productVariants
            .map((pv) => pv.categoryVariant)
            .filter(
              (v): v is { id: number; label: string; value: string } =>
                v !== null
            ),
        };
      })
      .filter(Boolean);

    return {
      category,
      products: uniqueProducts,
      categoryVariants,
      minPrice,
      maxPrice,
      selectedVariants,
    };
  } catch (e) {
    throw new Response("Error loading category: " + e, { status: 500 });
  }
}

function filterProductsByPriceAndVariants(
  productxVariants: (Product & {
    categoryVariant: { id: number; label: string; value: string } | null;
    finalPrice: number;
    minPricexProduct: number;
    maxPricexProduct: number;
  })[],
  minPrice: string,
  maxPrice: string,
  selectedVariants: string[]
) {
  const min = minPrice ? parseFloat(minPrice) : 0;
  const max = maxPrice ? parseFloat(maxPrice) : Infinity;

  return productxVariants.filter((productVariant) => {
    // Filtro por precio
    const priceInRange =
      productVariant.finalPrice >= min && productVariant.finalPrice <= max;

    // Filtro por variantes (si hay variantes seleccionadas)
    const variantMatch =
      selectedVariants.length === 0 ||
      !productVariant.categoryVariant ||
      selectedVariants.includes(productVariant.categoryVariant.id.toString());

    return priceInRange && variantMatch;
  });
}

export default function Category({ loaderData }: Route.ComponentProps) {
  const {
    category,
    products,
    categoryVariants,
    minPrice,
    maxPrice,
    selectedVariants,
  } = loaderData;

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
              categoryVariants={categoryVariants}
              selectedVariants={selectedVariants}
              className="w-full max-w-sm lg:max-w-xs"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-grow">
              {products
                .filter((product) => product !== null)
                .map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
