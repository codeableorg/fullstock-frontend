import { Link } from "react-router";

import { Product } from "@/models/product.model";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="border border-separator rounded-xl relative overflow-hidden flex flex-col h-full">
        <div className="aspect-[3/4] bg-muted ">
          <img
            src={product.imgSrc}
            alt={product.title}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4 flex flex-col gap-2 grow">
          <h2 className="text-sm font-medium">{product.title}</h2>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="text-base font-medium mt-auto">${product.price}</p>
        </div>
        {product.isOnSale && (
          <span className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-sm font-medium rounded-es-xl">
            🚀 Oferta
          </span>
        )}
      </div>
    </Link>
  );
}
