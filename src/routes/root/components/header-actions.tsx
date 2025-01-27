import { Search, ShoppingCart, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

export default function HeaderActions() {
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
      >
        <Link to="/cart">
          <ShoppingCart />
        </Link>
      </Button>
    </div>
  );
}
