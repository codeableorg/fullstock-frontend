import { prisma } from "@/db/prisma";
import type { Category } from "@/models/category.model";
import type { Product, ProductDTO } from "@/models/product.model";
import type { VariantAttributeValue } from "@/models/variant-attribute.model";

import { getCategoryBySlug } from "./category.service";

export const formattedProduct = (product: ProductDTO): Product => {
  const { variantAttributeValues, ...rest } = product;
  const prices = variantAttributeValues.map((v: VariantAttributeValue) =>
    v.price.toNumber()
  );
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  if (minPrice === maxPrice) {
    return {
      ...rest,
      price: minPrice,
    };
  }
  return {
    ...rest,
    minPrice,
    maxPrice,
  };
};

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      variantAttributeValues: true,
    },
  });

  return products.map(formattedProduct);
}

export async function getProductById(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variantAttributeValues: {
        include: {
          variantAttribute: true,
        },
      },
    },
  });
  if (!product) {
    throw new Error("Product not found");
  }
  const productWithParsedPrices = {
    ...product,
    variantAttributeValues: product.variantAttributeValues.map((variant) => ({
      ...variant,
      price: variant.price.toNumber(),
    })),
  };

  return productWithParsedPrices as unknown as Product;
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      variantAttributeValues: true,
    },
  });
  return products.map(formattedProduct);
}

export async function filterByMinMaxPrice(
  slug: string,
  min?: number,
  max?: number
): Promise<Product[]> {
  const priceFilter: {  gte?: number; lte?: number } = {};

  if (min !== undefined) {
    priceFilter.gte = min;
  }
  if (max !== undefined) {
    priceFilter.lte = max;
  }

  const result = await prisma.product.findMany({
    where: {
      category: {
        slug: slug as Category["slug"], // si slug es enum
      },
      variantAttributeValues: {
        some: {
          price: priceFilter, // 👈 el rango se aplica al mismo variant
        },
      },
    },
    include: {
      variantAttributeValues: true,
    },
  });

  return result.map(formattedProduct);
}