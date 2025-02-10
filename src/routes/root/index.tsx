import { useState } from "react";
import { Link, Outlet, ScrollRestoration } from "react-router";

import { Button, Container, Input, Section, Separator } from "@/components/ui";

import AuthNav from "./components/auth-nav";
import HeaderMain from "./components/header-main";
import styles from "./styles.module.css";

export default function Root() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Suscripción exitosa");
      setEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <header className={styles.root__header}>
        <AuthNav />
        <HeaderMain />
      </header>
      <main className={styles.root__main}>
        <Outlet />
      </main>
      <footer className={styles.root__footer}>
        <Container>
          <Section className={styles["root__footer-section"]}>
            <div className={styles["root__footer-links"]}>
              <ul className={styles["root__footer-list"]}>
                <li className={styles["root__footer-title"]}>Tienda</li>
                <li>
                  <Link to="/polos">Polos</Link>
                </li>
                <li>
                  <Link to="/tazas">Tazas</Link>
                </li>
                <li>
                  <Link to="/stickers">Stickers</Link>
                </li>
              </ul>
              <ul className={styles["root__footer-list"]}>
                <li className={styles["root__footer-title"]}>Compañía</li>
                <li>
                  <Link to="/quienes-somos">Quienes somos</Link>
                </li>
                <li>
                  <Link to="/terminos">Términos y condiciones</Link>
                </li>
                <li>
                  <Link to="/privacidad">Privacidad</Link>
                </li>
              </ul>
              <ul className={styles["root__footer-list"]}>
                <li className={styles["root__footer-title"]}>Conecta</li>
                <li>
                  <Link to="/contacto">Contáctanos</Link>
                </li>
                <li>
                  <Link to="https://www.facebook.com/" target="_blank">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link to="https://www.instagram.com/" target="_blank">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles["root__footer-newsletter"]}>
              <p className={styles["root__footer-newsletter-title"]}>
                Suscríbete a nuestro boletín
              </p>
              <p className={styles["root__footer-newsletter-text"]}>
                Recibe las últimas ofertas y descuentos en tu correo
                semanalmente.
              </p>
              <form
                className={styles["root__footer-form"]}
                onSubmit={handleSubmit}
              >
                <Input
                  type="email"
                  aria-label="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="ejemplo@mail.com"
                />
                <Button
                  size="lg"
                  variant="secondary"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Suscribirse"}
                </Button>
              </form>
            </div>
          </Section>
          <Separator orientation="horizontal" decorative={true} />
          <small className={styles["root__footer-copyright"]}>
            Todos los derechos reservados © Full Stock
          </small>
        </Container>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
