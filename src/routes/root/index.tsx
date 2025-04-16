import { Suspense, useEffect, useRef } from "react";
import {
  Link,
  Outlet,
  ScrollRestoration,
  ActionFunctionArgs,
  useFetcher,
  useLoaderData,
  useLocation,
  useSubmit,
} from "react-router";

import {
  Button,
  Container,
  ContainerLoader,
  Input,
  Section,
  Separator,
} from "@/components/ui";
import { User } from "@/models/user.model";
import { getCurrentUser } from "@/services/auth.service";

import AuthNav from "./components/auth-nav";
import HeaderMain from "./components/header-main";
import {
  alterQuantityCartItem,
  createRemoteItems,
  deleteLocalCart,
  getLocalCart,
  getRemoteCart,
} from "@/services/cart.service";
import { Cart } from "@/models/cart.model";
import { Product } from "@/models/product.model";

// Method to change quantity of item in cart
const changeItemQuantity = async (product: Product, quantity: number = 1) => {
  // MODIFICAR PARA GRABAR EN LA BBDD
  //setLoading(true);
  try {
    if (user) {
      const updatedCart = await alterQuantityCartItem(product.id, quantity);
      //setCart(updatedCart);
      return;
    }

    const updatedItems = cart ? [...cart.items] : [];
    const existingItem = updatedItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else if (quantity > 0) {
      updatedItems.push({
        id: Date.now(),
        product,
        quantity,
      });
    }

    const updatedCart = {
      id: Date.now(),
      items: updatedItems,
      total: updatedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    };
    //setLocalCart(updatedCart);
    //setCart(updatedCart);
  } catch (error) {
    console.error(error);
    //setError("Failed to add item");
  } finally {
    //setLoading(false);
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  const intent = data.get("intent");

  const product = JSON.parse(data.get("product") as string) as Product;

  switch (intent) {
    case "changeItemQuantity":
      await changeItemQuantity(product);

      break;
    default:
      throw new Error("Acción no soportada");
  }

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

type LoaderData = { user?: Omit<User, "password">; cart: Cart | null };

export async function loader(): Promise<LoaderData | undefined> {
  const user = await getCurrentUser();
  try {
    const localCart = getLocalCart(); // obtiene carrito del localstorage
    if (!user) {
      // SIN USUARIO
      //setCart(localCart);
      return { cart: localCart };
    }
    // CON USUARIO
    const remoteCart = await getRemoteCart(); // obtiene carrito de la bbdd
    if (remoteCart?.items.length) {
      // CARRITO DDBB CON PRODUCTOS
      //setCart(remoteCart);
      deleteLocalCart(); // borra carrito del localstorage
      return { user, cart: remoteCart };
    }
    //CARRITO DDBB SIN PRODUCTOS
    if (localCart) {
      // CARRITO LOCAL CON PRODUCTOS
      const updatedCart = await createRemoteItems(localCart.items); // graba carrito local en la bbdd
      //setCart(updatedCart);
      deleteLocalCart(); // borra carrito del localstorage
      return { user, cart: updatedCart };
    }
  } catch (error) {
    console.error(error);
    //setError("Failed to load cart");
  }
  //return user ? { user, cart: null } : undefined;
}

export default function Root() {
  const { user, cart } = useLoaderData() as LoaderData;

  const location = useLocation();
  const fetcher = useFetcher();
  const emailRef = useRef<HTMLInputElement>(null);
  const isSubmitting = fetcher.state === "submitting";
  const submit = useSubmit();

  useEffect(() => {
    if (fetcher.data?.ok && emailRef.current) {
      emailRef.current.value = "";
    }
  }, [fetcher.data]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-background">
      <header className="sticky top-0 bg-background border-b border-border z-50">
        <AuthNav user={user} />
        <HeaderMain user={user} />
      </header>
      <main>
        <Suspense fallback={<ContainerLoader />} key={location.key}>
          <Outlet context={{ cart, submit }} />
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
