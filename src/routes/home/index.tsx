import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Truck, Return, Ribbon, Idea } from "@/components/icons";

import heroSrc from "@/assets/hero.jpg";
import polosSrc from "@/assets/polos.jpg";
import stickersSrc from "@/assets/stickers.jpg";
import tazasSrc from "@/assets/tazas.jpg";

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
              <Link
                to={category.title.toLowerCase()}
                className="basis-0 grow group"
                key={category.title}
              >
                <div className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={category.imageSrc}
                    alt={category.alt}
                    className="w-full aspect-[3/2] md:aspect-[4/5] object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 group-hover:underline">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-12 md:py-24 bg-muted">
        <Container className="text-center">
          <h2 className="text-2xl font-bold mb-12">
            Nuestra Promesa de Calidad
          </h2>
          <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-4">
            <div>
              <Truck className="mb-6 inline-block" />
              <h3 className="font-medium mb-2 text-sm">Entrega rápida</h3>
              <p className=" text-sm text-muted-foreground">
                Recibe tus productos en tiempo récord, directo a tu puerta, para
                que puedas disfrutar de ellos cuanto antes.
              </p>
            </div>
            <div>
              <Return className="mb-6 inline-block" />
              <h3 className="font-medium mb-2 text-sm">
                Satisfacción Garantizada
              </h3>
              <p className=" text-sm text-muted-foreground">
                Tu felicidad es nuestra prioridad. Si no estás 100% satisfecho,
                estamos aquí para ayudarte con cambios o devoluciones.
              </p>
            </div>
            <div>
              <Ribbon className="mb-6 inline-block" />
              <h3 className="font-medium mb-2 text-sm">
                Materiales de Alta Calidad
              </h3>
              <p className=" text-sm text-muted-foreground">
                Nos aseguramos de que todos nuestros productos estén hechos con
                materiales de la más alta calidad.
              </p>
            </div>
            <div>
              <Idea className="mb-6 inline-block" />
              <h3 className="font-medium mb-2 text-sm">Diseños Exclusivos</h3>
              <p className=" text-sm text-muted-foreground">
                Cada producto está diseñado pensando en los desarrolladores, con
                estilos únicos que no encontrarás en ningún otro lugar.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
