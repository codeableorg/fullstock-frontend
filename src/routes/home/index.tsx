import { ServerCrash } from "lucide-react";
import { Link } from "react-router";

import { Truck, Return, Ribbon, Idea } from "@/components/icons";
import { Button, Container, ContainerLoader } from "@/components/ui";
import { useAsync } from "@/hooks/use-async";
import { Category } from "@/models/category.model";
import { getAllCategories } from "@/services/category.service";

import styles from "./styles.module.css";

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
      <section className={styles.hero}>
        <Container className={styles.hero__container}>
          <h2 className={styles.hero__title}>Nuevos productos disponibles</h2>
          <p className={styles.hero__text}>
            Un pequeño lote de increíbles productos acaba de llegar.
            <br />
            Agrega tus favoritos al carrito antes que se agoten.
          </p>
          <Button size="xl" asChild>
            <Link to="/polos">Compra ahora</Link>
          </Button>
        </Container>
      </section>

      <section className={styles.categories}>
        <Container>
          <div className={styles.categories__header}>
            <h2 className={styles.categories__title}>Compra por categoría</h2>
            <p className={styles.categories__description}>
              Explora nuestra selección de productos especialmente diseñados
              para desarrolladores web.{" "}
              <br className={styles["categories__description-break"]} />
              Encuentra lo que buscas navegando por nuestras categorías de
              polos, tazas, stickers y más.
            </p>
          </div>
          <div className={styles.categories__grid}>
            {error && (
              <div className={styles.error}>
                <p className={styles.errorMessage}>
                  Hubo un error al cargar las categorías
                </p>
                <p className={styles.errorMessage}>
                  <ServerCrash />
                </p>
              </div>
            )}
            {categories?.map((category) => (
              <Link
                to={category.title.toLowerCase()}
                className={styles.category}
                key={category.title}
              >
                <div className={styles.category__image}>
                  <img
                    src={category.imgSrc}
                    alt={category.alt || `${category.title}`}
                  />
                </div>
                <div>
                  <h3 className={styles.category__title}>{category.title}</h3>
                  <p className={styles.category__description}>
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className={styles.features}>
        <Container>
          <h2 className={styles.features__title}>Nuestra Promesa de Calidad</h2>
          <div className={styles.features__grid}>
            {features.map(({ Icon, title, description }) => (
              <div key={title} className={styles.feature}>
                <Icon className={styles.feature__icon} />
                <h3 className={styles.feature__title}>{title}</h3>
                <p className={styles.feature__description}>{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
