import { useParams } from "react-router";

import { Container } from "@/components/ui";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <section className="py-12 sm:py-14 lg:py-16">
      <Container>
        <h1 className="font-semibold text-accent-foreground mb-2">
          ¡Muchas gracias por tu compra!
        </h1>
        <p className="text-4xl font-bold mb-2">Tu orden está en camino</p>
        <p className="text-muted-foreground mb-12">
          Llegaremos a la puerta de tu domicilio lo antes posible
        </p>
        <p className="text-sm font-medium mb-2">Código de seguimiento</p>
        <p className="text-sm font-medium text-accent-foreground">{orderId}</p>
      </Container>
    </section>
  );
}
