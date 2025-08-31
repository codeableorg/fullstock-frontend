import { Link } from "react-router";

import type { Product } from "@/models/product.model";

interface CategoryVariant {
  id: number;
  label: string;
  value: string;
}

interface ProductCardProps {
  product: Product & {
    minPricexProduct?: number;
    maxPricexProduct?: number;
    hasVariants?: boolean;
    categoryVariants?: CategoryVariant[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  // ✅ NUEVO: Calcular display de precio
  const renderPrice = () => {
    if (
      product.hasVariants &&
      product.minPricexProduct &&
      product.maxPricexProduct
    ) {
      if (product.minPricexProduct === product.maxPricexProduct) {
        return `S/${product.minPricexProduct.toFixed(2)}`;
      }
      return `S/${product.minPricexProduct.toFixed(
        2
      )} - S/${product.maxPricexProduct.toFixed(2)}`;
    }
    return `S/${product.price.toFixed(2)}`;
  };

  const renderVariants = () => {
    if (!product.hasVariants || !product.categoryVariants?.length) {
      return null;
    }

    return (
      <div className="flex gap-1">
        {product.categoryVariants?.slice(0, 3).map((variant) => (
          <span
            key={variant.id}
            className="px-1.5 py-0.5 text-xs bg-muted rounded"
          >
            {variant.label}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="block"
      data-testid="product-item"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-separator group">
        <div className="aspect-[3/4] bg-muted">
          <img
            src={product.imgSrc}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>
        <div className="flex grow flex-col gap-2 p-4">
          <h2 className="text-sm font-medium">{product.title}</h2>
          <p className="text-sm text-muted-foreground">{product.description}</p>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <p className="text-base font-medium">{renderPrice()}</p>
              {renderVariants()}
            </div>
          </div>
        </div>
        {product.isOnSale && (
          <span className="absolute top-0 right-0 rounded-bl-xl bg-primary px-2 py-1 text-sm font-medium text-primary-foreground">
            🚀 Oferta
          </span>
        )}
      </div>
    </Link>
  );
}
