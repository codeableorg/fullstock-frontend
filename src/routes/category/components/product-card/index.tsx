import { Link } from "react-router";

import { Product } from "@/models/product.model";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-700">
          <img
            src={product.imgSrc}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-200 hover:scale-105"
          />
        </div>
        <div className="flex grow flex-col gap-2 p-4">
          <h2 className="text-base font-medium text-gray-800 dark:text-gray-100">{product.title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {product.description}
          </p>
          <p className="mt-auto text-lg font-medium text-gray-900 dark:text-gray-200">${product.price}</p>
        </div>
        {product.isOnSale && (
          <span className="absolute top-0 right-0 rounded-bl-xl bg-[hsl(240,62%,57%)] px-2 py-1 text-xs font-medium text-white">🚀 Oferta</span>
        )}
      </div>
    </Link>
  );
}
