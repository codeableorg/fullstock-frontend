import { Suspense, useState } from "react";
import { Link, Outlet, ScrollRestoration, useLocation } from "react-router";

import {
  Button,
  Container,
  ContainerLoader,
  Input,
  Section,
  Separator,
} from "@/components/ui";

import AuthNav from "./components/auth-nav";
import HeaderMain from "./components/header-main";

export default function Root() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

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
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border z-50">
        <AuthNav />
        <HeaderMain />
      </header>
      <main>
        <Suspense fallback={<ContainerLoader />} key={location.key}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-border">
        <Container>
          <Section className="flex flex-col gap-8 lg:flex-row">
            <div className="flex flex-wrap gap-y-4 gap-x-8 flex-grow">
              <ul className="flex-1 basis-40 flex flex-col gap-6 text-sm text-muted-foreground">
                <li className="font-medium text-foreground">Tienda</li>
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
              <ul className="flex-1 basis-40 flex flex-col gap-6 text-sm text-muted-foreground">
                <li className="font-medium text-foreground">Compañía</li>
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
              <ul className="flex-1 basis-40 flex flex-col gap-6 text-sm text-muted-foreground">
                <li className="font-medium text-foreground">Conecta</li>
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
            <div className="text-sm max-w-md">
              <p className="font-medium mb-6">Suscríbete a nuestro boletín</p>
              <p className="text-muted-foreground mb-2">
                Recibe las últimas ofertas y descuentos en tu correo
                semanalmente.
              </p>
              <form className="flex gap-2" onSubmit={handleSubmit}>
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
          <small className="block text-center text-sm text-muted-foreground py-6">
            Todos los derechos reservados © Full Stock
          </small>
        </Container>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
