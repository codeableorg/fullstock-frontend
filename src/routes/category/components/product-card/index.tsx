import { Link } from "react-router";

import { Product } from "@/models/product.model";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const random = Math.random();
  const hasError = random < 0.1;

  if (hasError) throw new Error("No se pudo cargar el producto");

  return (
    <Link to={`/products/${product.id}`} className="block">
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
          <p className="mt-auto text-base font-medium">${product.price}</p>
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
