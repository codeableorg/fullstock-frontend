import { prisma } from "@/db/prisma";
import type { Category } from "@/models/category.model";
import type { Product, ProductVariantValue } from "@/models/product.model";
import type { VariantAttributeValue } from "@/models/variant-attribute.model";

import { getCategoryBySlug } from "./category.service";

const formattedProduct = (product: ProductVariantValue) => {
  const {variantAttributeValues, ...rest} = product
  
  const prices = variantAttributeValues.map((v: VariantAttributeValue) => Number(v.price))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  // Agrupar y formatear variantes
  const variants = variantAttributeValues.map(v => ({
    id: v.id,
    attributeId: v.attributeId,
    value: v.value,
    price: Number(v.price)
  }))
  
  // Determinar tipo de variante basado en attributeId
  const getVariantType = (attributeId: number) => {
    switch (attributeId) {
      case 1: return 'talla'
      case 2: return 'dimensión'  
      case 3: return 'único'
      default: return 'variante'
    }
  }
  
  const variantType = variants.length > 0 ? getVariantType(variants[0].attributeId) : 'único'
  
  return {
    ...rest,
    variants,
    variantType,
    ...(minPrice === maxPrice ? { price: minPrice } : { minPrice, maxPrice })
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
      variantAttributeValues: {
        include: {
          variantAttribute: true
        }
      }
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
