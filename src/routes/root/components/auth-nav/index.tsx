import { Link, useNavigate } from "react-router";

import { Button, Container } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";

import styles from "./styles.module.css";

export default function AuthNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles["auth-nav"]}>
      <Container className={styles["auth-nav__container"]}>
        <nav aria-label="Autenticación de usuario">
          <ul className={styles["auth-nav__list"]}>
            {user ? (
              <>
                <li className={styles["auth-nav__item"]}>
                  Bienvenido {user.name || user.email}
                </li>
                <li className={styles["auth-nav__item"]}>
                  <Button
                    variant="ghost"
                    className={styles["auth-nav__button"]}
                    onClick={onLogout}
                  >
                    Cerrar sesión
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li className={styles["auth-nav__item"]}>
                  <Link to="/login" className={styles["auth-nav__link"]}>
                    Iniciar sesión
                  </Link>
                </li>
                <li className={styles["auth-nav__item"]}>
                  <Link to="/signup" className={styles["auth-nav__link"]}>
                    Crear una cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
