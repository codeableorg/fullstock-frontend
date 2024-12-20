import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import heroSrc from "@/assets/hero.jpeg";

export default function Home() {
  return (
    <>
      <section
        className="text-center bg-cover bg-no-repeat bg-center"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url('${heroSrc}')`,
        }}
      >
        <Container className="py-32 max-w-3xl">
          <h2 className="text-4xl font-bold mb-4 md:text-6xl">
            Nuevos productos disponibles
          </h2>
          <p className="text-xl mb-8">
            Un pequeño lote de increíbles productos acaba de llegar.
            <br />
            Agrega tus favoritos al carrito antes que se agoten.
          </p>
          <Button size="xl">Compra ahora</Button>
        </Container>
      </section>
    </>
  );
}
