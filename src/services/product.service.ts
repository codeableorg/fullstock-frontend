import { prisma } from "@/db/prisma";
import type { Category } from "@/models/category.model";
import type { Product, ProductVariantValue } from "@/models/product.model";
import type { VariantAttributeValue } from "@/models/variant-attribute.model";

import { getCategoryBySlug } from "./category.service";

const formattedProduct = (product: ProductVariantValue)  => {
    const {variantAttributeValues, ...rest} = product
    const prices = variantAttributeValues.map((v: VariantAttributeValue) => Number(v.price))
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    if (minPrice === maxPrice) {
      return {
        ...rest,
        price: minPrice
      }
    }
    return {
      ...rest,
      minPrice,
      maxPrice
    }
}

export async function getProductsByCategorySlug(
  categorySlug: Category["slug"]
): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  const products = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: {
      variantAttributeValues: true
    }
  });

  return products.map(formattedProduct)
}

export async function getProductById(id: number): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variantAttributeValues: true
    }
  });

  if (!product) {
    throw new Error("Product not found");
  }
  const variants = product.variantAttributeValues.map((variant)=> ({
    ...variant,
    price: Number(variant.price)
  }))

return {...product, variantAttributeValues: variants } as Product
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: {
      variantAttributeValues: true
    }
  });
  return products.map(formattedProduct)
}
