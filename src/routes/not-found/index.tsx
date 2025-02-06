import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Container>
      <Section className="flex justify-center items-center">
        <div className="text-center">
          <p className="text-base font-semibold text-accent-foreground">404</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Página no encontrada
          </h1>
          <p className="mt-6 text-lg font-medium text-muted-foreground sm:text-xl/8">
            No pudimos encontrar la página que estás buscando.
          </p>
          <Button className="mt-10" asChild size="xl">
            <Link to="/">Regresar al inicio</Link>
          </Button>
        </div>
      </Section>
    </Container>
  );
}
