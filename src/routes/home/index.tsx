import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import heroSrc from "@/assets/hero.jpg";
import polosSrc from "@/assets/polos.jpg";
import tazasSrc from "@/assets/tazas.jpg";
import stickersSrc from "@/assets/stickers.jpg";

const categoriesContent = [
  {
    title: "Polos",
    imageSrc: polosSrc,
    alt: "Hombre luciendo polo azul",
    description:
      "Polos exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
  },
  {
    title: "Tazas",
    imageSrc: tazasSrc,
    alt: "Tazas con diseño de código",
    description:
      "Tazas que combinan perfectamente con tu café matutino y tu pasión por la programación. ¡Empieza el día con estilo!",
  },
  {
    title: "Stickers",
    imageSrc: stickersSrc,
    alt: "Stickers de desarrollo web",
    description:
      "Personaliza tu espacio de trabajo con nuestros stickers únicos y muestra tu amor por el desarrollo web.",
  },
];

export default function Home() {
  return (
    <>
      <section
        className="text-center bg-cover bg-no-repeat bg-center text-white"
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
      <section className="py-12 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 md:text-4xl">
              Compra por categoría
            </h2>
            <p className="text-muted-foreground mb-10">
              Explora nuestra selección de productos especialmente diseñados
              para desarrolladores web. <br className="hidden md:block" />
              Encuentra lo que buscas navegando por nuestras categorías de
              polos, tazas, stickers y más.
            </p>
          </div>
          <div className="flex flex-col gap-8 md:flex-row">
            {categoriesContent.map((category) => (
              <div className="basis-0 grow" key={category.title}>
                <div className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={category.imageSrc}
                    alt={category.alt}
                    className="w-full aspect-[3/2] md:aspect-[4/5] object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
