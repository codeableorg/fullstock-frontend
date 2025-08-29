import { Link, useNavigate } from "react-router";
import { useState } from "react";

import type { Product } from "@/models/product.model";
import { Button } from "@/components/ui";

interface ProductCardProps {
  product: Product;
  categorySlug: string;
  minPrice?: string;
  maxPrice?: string;
}

export function ProductCard({
  product,
  categorySlug,
  minPrice,
  maxPrice,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  let variantTitle: string | null = null;
  let variants: string[] = [];
  let variantParamName: "size" | "measure" | null = null;

  const variantMap: Record<string, string> = {
    "3*3": "3*3",
    "5*5": "5*5",
    "10*10": "10*10",
  };

  // Obtener el precio base para stickers para la variante 3*3
  const getBasePrice = () => {
    if (categorySlug === "stickers" && product.stickersVariants?.length) {
      const baseVariant = product.stickersVariants.find(
        (variant) => variant.measure === "3*3"
      );
      return baseVariant ? baseVariant.price : product.price;
    }
    return product.price;
  };

  // Obtener rango de precios para las variantes filtradas
  const getPriceRange = () => {
    if (categorySlug === "stickers" && product.stickersVariants?.length && variants.length > 0) {
      const filteredVariants = product.stickersVariants.filter(variant => 
        variants.includes(variant.measure)
      );
      
      if (filteredVariants.length > 0) {
        const minPrice = Math.min(...filteredVariants.map(v => v.price));
        const maxPrice = Math.max(...filteredVariants.map(v => v.price));
        
        if (minPrice === maxPrice) {
          return `S/${minPrice}`;
        }
        return `S/${minPrice} - S/${maxPrice}`;
      }
    }
    return null;
  };

  if (categorySlug === "polos") {
    variantTitle = "Elige la talla";
    variants = ["Small", "Medium", "Large"];
    variantParamName = "size";
  } else if (categorySlug === "stickers") {
    variantTitle = "Elige la medida";

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    if (product.stickersVariants?.length) {
      variants = product.stickersVariants
        .filter((variant) => variant.price >= min && variant.price <= max)
        .map((variant) => variant.measure);
    } else {
      variants = ["3*3", "5*5", "10*10"];
    }
    variantParamName = "measure";
  }

  const basePrice = getBasePrice();
  const priceRange = getPriceRange();

  const handleVariantClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    variant: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantParamName) {
      const paramValue =
        variantParamName === "size" ? variant.toLowerCase() : variant;
      navigate(`/products/${product.id}?${variantParamName}=${paramValue}`);
    }
  };

  const hoverVariantClick = (variant: string) => {
    if (variantParamName === "measure") {
      if (product.stickersVariants && product.stickersVariants.length > 0) {
        const variantPrice = product.stickersVariants.find(
          (v) => v.measure === variant
        )?.price;
        setHoveredPrice(variantPrice || null);
      } else {
        setHoveredPrice(null);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredPrice(null);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="block"
      data-testid="product-item"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-separator group">
        <div className="relative aspect-[3/4] bg-muted">
          <img
            src={product.imgSrc}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
          />
          {variantTitle && (
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center bg-black/50 p-4 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <h2 className="mb-4 text-xl font-bold">{variantTitle}</h2>
              <div className="flex gap-2">
                {variants.map((variant) => (
                  <Button
                    key={variant}
                    onClick={(e) => handleVariantClick(e, variant)}
                    onMouseEnter={() => hoverVariantClick(variant)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex grow flex-col gap-2 p-4">
          <h2 className="text-sm font-medium">{product.title}</h2>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="mt-auto text-base font-medium">
            {hoveredPrice !== null ? `S/${hoveredPrice}` : (priceRange ? priceRange : `S/${basePrice}`)}
          </p>
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
