import { ShoppingCart, User2 } from "lucide-react";
import { Link } from "react-router";

import { Button, Separator } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { useCart } from "@/contexts/cart.context";

import styles from "./styles.module.css";

export default function HeaderActions() {
  const { user } = useAuth();
  const { cart } = useCart();
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className={styles["header-actions"]}>
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
          <Separator
            orientation="vertical"
            className={styles["header-actions__separator"]}
          />
        </>
      )}
      <Button
        size="xl-icon"
        variant="ghost"
        aria-label="Carrito de compras"
        asChild
        className={styles["header-actions__cart"]}
      >
        <Link to="/cart">
          <ShoppingCart />
          {totalItems > 0 && (
            <span className={styles["header-actions__cart-badge"]}>
              {totalItems}
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
}
