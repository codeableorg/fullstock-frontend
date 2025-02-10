import { Navigate, Outlet, NavLink } from "react-router";

import { Container, Section } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

export default function Account() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Section>
      <Container className={styles.account}>
        <div className={styles.account__header}>
          <h1 className={styles.account__title}>Mi cuenta</h1>
          <p className={styles.account__description}>
            Actualiza tu perfil y revisa tus historial pedidos.
          </p>
        </div>

        <div className={styles.account__nav_wrapper}>
          <nav className={styles.account__nav}>
            <NavLink
              to="/account/profile"
              className={({ isActive }) =>
                cn(
                  styles.account__nav_link,
                  isActive && styles["account__nav_link--active"]
                )
              }
            >
              Perfil
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                cn(
                  styles.account__nav_link,
                  isActive && styles["account__nav_link--active"]
                )
              }
            >
              Historial de Pedidos
            </NavLink>
          </nav>
        </div>

        <Outlet />
      </Container>
    </Section>
  );
}
