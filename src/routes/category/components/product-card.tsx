import { Product } from "@/services/products/product.types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border border-separator rounded-xl relative overflow-hidden">
      <div className="object-cover aspect-[3/4] bg-muted ">
        <img
          src={product.imgSrc}
          alt={product.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-sm font-medium">{product.title}</h2>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <p className="text-base font-medium">${product.price}</p>
      </div>
      {product.isOnSale && (
        <span className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-sm font-medium rounded-es-xl">
          🚀 Oferta
        </span>
      )}
    </div>
  );
}
