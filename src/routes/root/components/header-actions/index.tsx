import { ShoppingCart, User2 } from "lucide-react";
import { Link } from "react-router";

import { Button, Separator } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { useCart } from "@/contexts/cart.context";

export default function HeaderActions() {
  const { user } = useAuth();
  const { cart } = useCart();
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="flex gap-2 items-center">
      {user && (
        <>
          <Link to="/account">
            <Button
              size="xl-icon"
              variant="ghost"
              aria-label="Cuenta de usuario"
            >
              <User2 />
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}
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
