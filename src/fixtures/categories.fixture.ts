import { Category } from "@/models/category.model";

export const categories: Category[] = [
  {
    id: "cat_polos",
    title: "Polos",
    slug: "polos",
    imageSrc: "/images/polos.jpg",
    alt: "Hombre luciendo polo azul",
    description:
      "Polos exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
  },
  {
    id: "cat_tazas",
    title: "Tazas",
    slug: "tazas",
    imageSrc: "/images/tazas.jpg",
    alt: "Tazas con diseño de código",
    description:
      "Tazas que combinan perfectamente con tu café matutino y tu pasión por la programación. ¡Empieza el día con estilo!",
  },
  {
    id: "cat_stickers",
    title: "Stickers",
    slug: "stickers",
    imageSrc: "/images/stickers.jpg",
    alt: "Stickers de desarrollo web",
    description:
      "Personaliza tu espacio de trabajo con nuestros stickers únicos y muestra tu amor por el desarrollo web.",
  },
];
