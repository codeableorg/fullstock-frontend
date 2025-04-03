import { Link } from "react-router";

import { Button, Container, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <Container>
      <Section className='flex justify-center items-center'>
        <div className='text-center'>
          <p className='text-base font-semibold text-accent-foreground'>404</p>
          <h1 className='text-4xl leading-9 font-bold tracking-tight text-foreground mt-4 sm:text-6xl sm:leading-none'>Página no encontrada</h1>
          <p className='text-lg font-medium text-muted-foreground mt-6 sm:text-xl leading-none'>
            No pudimos encontrar la página que estás buscando.
          </p>
          <Button className='mt-10' asChild size="xl">
            <Link to="/">Regresar al inicio</Link>
          </Button>
        </div>
      </Section>
    </Container>
  );
}
