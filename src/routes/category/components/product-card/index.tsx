import { Link } from "react-router";

import { Product } from "@/models/product.model";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-separator shadow-md hover:shadow-lg">
        <div className="relative aspect-[3/4] bg-muted">
          <img
            src={product.imgSrc}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-200 hover:scale-105"
          />
        </div>
        <div className="flex grow flex-col gap-2 p-4">
          <h2 className="text-base font-medium text-gray-800 dark:text-gray-100">{product.title}</h2>
          <p className="text-sm text-muted">
            {product.description}
          </p>
          <p className="mt-auto text-lg font-medium">${product.price}</p>
        </div>
        {product.isOnSale && (
          <span className="absolute top-0 right-0 rounded-bl-xl bg-primary-foreground px-2 py-1 text-xs font-medium text-primary">🚀 Oferta</span>
        )}
      </div>
    </Link>
  );
}
