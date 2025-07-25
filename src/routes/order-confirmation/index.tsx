import { Container } from "@/components/ui";

import type { Route } from "./+types";

export async function loader({ params }: Route.LoaderArgs) {
  const orderId = params.orderId;
  return { orderId };
}

export default function OrderConfirmation({
  loaderData,
}: Route.ComponentProps) {
  const { orderId } = loaderData;

  return (
    <section className="pt-12 pb-12 sm:pt-14 sm:pb-14 lg:pt-16 lg:pb-16">
      <Container>
        <h1 className="font-medium text-accent-foreground mb-2">
          ¡Muchas gracias por tu compra!
        </h1>
        <p className="text-2xl font-bold leading-9 mb-2">
          Tu orden está en camino
        </p>
        <p className="text-muted-foreground mb-12">
          Llegaremos a la puerta de tu domicilio lo antes posible
        </p>
        <p className="text-sm font-medium mb-2">Código de seguimiento</p>
        <p
          data-testid="orderId"
          className="text-sm font-medium text-accent-foreground"
        >
          {orderId}
        </p>
      </Container>
    </section>
  );
}
