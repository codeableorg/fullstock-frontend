import { ServerCrash } from "lucide-react";
import { Link } from "react-router";

import { Truck, Return, Ribbon, Idea } from "@/components/icons";
import { Button, Container, ContainerLoader } from "@/components/ui";
import { useAsync } from "@/hooks/use-async";
import { Category } from "@/models/category.model";
import { getAllCategories } from "@/services/category.service";

const features = [
  {
    Icon: Truck,
    title: "Entrega rápida",
    description:
      "Recibe tus productos en tiempo récord, directo a tu puerta, para que puedas disfrutar de ellos cuanto antes.",
  },
  {
    Icon: Return,
    title: "Satisfacción Garantizada",
    description:
      "Tu felicidad es nuestra prioridad. Si no estás 100% satisfecho, estamos aquí para ayudarte con cambios o devoluciones.",
  },
  {
    Icon: Ribbon,
    title: "Materiales de Alta Calidad",
    description:
      "Nos aseguramos de que todos nuestros productos estén hechos con materiales de la más alta calidad.",
  },
  {
    Icon: Idea,
    title: "Diseños Exclusivos",
    description:
      "Cada producto está diseñado pensando en los desarrolladores, con estilos únicos que no encontrarás en ningún otro lugar.",
  },
];

export default function Home() {
  const {
    data: categories,
    loading,
    error,
  } = useAsync<Category[]>(getAllCategories);

  if (loading) return <ContainerLoader />;

  return (
    <>
      <section className="text-center bg-cover bg-no-repeat bg-center text-white bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/images/hero.jpg')]">
        <Container className="pt-32 pb-32 max-w-3xl">
          <h2 className="text-4xl leading-10 font-bold mb-4">
            Nuevos productos disponibles
          </h2>
          <p className="text-lg mb-8">
            Un pequeño lote de increíbles productos acaba de llegar.
            <br />
            Agrega tus favoritos al carrito antes que se agoten.
          </p>
          <Button size="xl" asChild>
            <Link to="/polos">Compra ahora</Link>
          </Button>
        </Container>
      </section>

      <section className="py-12 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Compra por categoría
            </h2>
            <p className="text-muted-foreground mb-10">
              Explora nuestra selección de productos especialmente diseñados
              para desarrolladores web. <br className="hidden md:block" />
              Encuentra lo que buscas navegando por nuestras categorías de
              polos, tazas, stickers y más.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {error && (
              <div className="flex flex-col justify-center items-center mx-auto">
                <p className="text-accent-foreground text-2xl font-bold mb-4">
                  Hubo un error al cargar las categorías
                </p>
                <p className="text-accent-foreground text-2xl font-bold mb-4">
                  <ServerCrash />
                </p>
              </div>
            )}
            {categories?.map((category) => (
              <Link
                to={category.title.toLowerCase()}
                className="flex-1 flex-basis-0"
                key={category.title}
              >
                <div className="rounded-xl overflow-hidden mb-4">
                  <img
                    src={category.imgSrc}
                    alt={category.alt || `${category.title}`}
                    className="w-full aspect-[3/2] md:aspect-[4/5] object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 group-hover:underline">
                    {category.title}
                  </h3>
                  <p className="text-sm leading-5 text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-24 bg-muted text-center">
        <Container>
          <h2 className="text-2xl font-bold mb-12">
            Nuestra Promesa de Calidad
          </h2>
          <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 md:grid-cols-4">
            {features.map(({ Icon, title, description }) => (
              <div key={title} className="">
                <Icon className="inline-block mb-6" />
                <h3 className="text-sm leading-5 font-medium mb-2">{title}</h3>
                <p className="text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
