import { Link } from "react-router";
import { Search, ShoppingCart, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/cart";

export default function HeaderActions() {
  const {
    state: { items },
  } = useCart();
  const totalItems = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="flex gap-2 items-center">
      <Button size="xl-icon" variant="ghost" aria-label="Buscar">
        <Search />
      </Button>
      <Button size="xl-icon" variant="ghost" aria-label="Cuenta de usuario">
        <User2 />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        size="xl-icon"
        variant="ghost"
        aria-label="Carrito de compras"
        asChild
        className="relative"
      >
        <Link to="/cart">
          <ShoppingCart />
          {totalItems > 0 && (
            <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
}
