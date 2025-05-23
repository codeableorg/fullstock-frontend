import { Suspense, useEffect, useRef } from "react";
import {
  data,
  Link,
  Outlet,
  ScrollRestoration,
  useFetcher,
  useLocation,
} from "react-router";

import {
  Button,
  Container,
  ContainerLoader,
  Input,
  Section,
  Separator,
} from "@/components/ui";
import { getCart } from "@/lib/cart";
import { getCurrentUser } from "@/services/auth.service";
import { createRemoteItems } from "@/services/cart.service";
import { commitSession, getSession } from "@/session.server";

import AuthNav from "./components/auth-nav";
import HeaderMain from "./components/header-main";

import type { Route } from "./+types";

export async function action({ request }: Route.ActionArgs) {
  const data = await request.formData();

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      ok: true,
      message: `Suscripción exitosa con email: ${data.get("email")}`,
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Hubo un error al procesar tu solicitud" };
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const cartSessionId = session.get("cartSessionId");
  let totalItems = 0;

  // Obtenemos el usuario actual (autenticado o no)
  const user = await getCurrentUser(request);

  if (!user) {
    // Si no hay cartSessionId, crea un carrito de invitado
    if (!cartSessionId) {
      try {
        const cart = await createRemoteItems(request, []);
        const cartId = cart.sessionCartId;
        if (cartId) {
          session.set("cartSessionId", cartId);
        }
      } catch (error) {
        console.error("Error al crear carrito de invitado:", error);
      }
    }
  }

  // Obtener el carrito actualizado para contar los items
  try {
    const cart = await getCart(request);
    // Sumar las cantidades de cada ítem
    if (cart?.items && cart.items.length > 0) {
      totalItems = cart.items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
  }

  // Preparar datos de respuesta según estado de autenticación
  const responseData = user ? { user, totalItems } : { totalItems };

  return data(responseData, {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Root({ loaderData }: Route.ComponentProps) {
  const { totalItems, user } = loaderData;

  const location = useLocation();
  const fetcher = useFetcher();
  const emailRef = useRef<HTMLInputElement>(null);
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.ok && emailRef.current) {
      emailRef.current.value = "";
    }
  }, [fetcher.data]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border z-50">
        <AuthNav user={user} />
        <HeaderMain user={user} totalItems={totalItems} />
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
              <fetcher.Form method="post" className="flex gap-2">
                <Input
                  type="email"
                  ref={emailRef}
                  aria-label="email"
                  required
                  name="email"
                  disabled={isSubmitting}
                  placeholder="ejemplo@mail.com"
                />
                <Button
                  size="lg"
                  variant="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Suscribirse"}
                </Button>
              </fetcher.Form>
              <p className="text-muted-foreground my-2">
                {fetcher.data?.message}
              </p>
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
