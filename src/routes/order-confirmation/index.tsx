import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <section className="py-12 md:py-24">
      <Container className="max-w-xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="text-primary w-16 h-16" />
        </div>
        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-muted-foreground mb-8">
          Tu orden #{orderId} ha sido confirmada y está siendo procesada. Te
          enviaremos un correo electrónico con los detalles de tu compra.
        </p>
        <Button size="xl" asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </Container>
    </section>
  );
}
