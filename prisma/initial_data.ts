import type { CategorySlug } from "generated/prisma";

export const categories = [
  {
    title: "Polos",
    slug: "polos" as CategorySlug,
    imgSrc: "/images/polos.jpg",
    alt: "Hombre luciendo polo azul",
    description:
      "Polos exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
  },
  {
    title: "Tazas",
    slug: "tazas" as CategorySlug,
    imgSrc: "/images/tazas.jpg",
    alt: "Tazas con diseño de código",
    description:
      "Tazas que combinan perfectamente con tu café matutino y tu pasión por la programación. ¡Empieza el día con estilo!",
  },
  {
    title: "Stickers",
    slug: "stickers" as CategorySlug,
    imgSrc: "/images/stickers.jpg",
    alt: "Stickers de desarrollo web",
    description:
      "Personaliza tu espacio de trabajo con nuestros stickers únicos y muestra tu amor por el desarrollo web.",
  },
];

export const products = [
  {
    title: "Polo React",
    imgSrc: "/images/polos/polo-react.png",
    price: 20.0,
    description:
      "Viste tu pasión por React con estilo y comodidad en cada línea de código.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Estampado resistente que mantiene sus colores vibrantes lavado tras lavado.",
      "Hecho de algodón suave que asegura comodidad y frescura.",
      "Costuras reforzadas para una mayor durabilidad.",
      "Corte moderno que se adapta perfectamente al cuerpo.",
    ],
  },
  {
    title: "Polo JavaScript",
    imgSrc: "/images/polos/polo-js.png",
    price: 20.0,
    description:
      "Deja que tu amor por JavaScript hable a través de cada hilo de este polo.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Logo de JavaScript bordado con precisión y detalle.",
      "Tela premium de algodón peinado.",
      "Disponible en varios colores.",
      "Acabado profesional con doble costura.",
    ],
  },
  {
    title: "Polo Node.js",
    imgSrc: "/images/polos/polo-node.png",
    price: 20.0,
    description:
      "Conéctate al estilo con este polo de Node.js, tan robusto como tu código.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Diseño minimalista con el logo de Node.js.",
      "Material transpirable ideal para largas sesiones de código.",
      "Tejido resistente a múltiples lavados.",
      "Etiqueta sin costuras para mayor comodidad.",
    ],
  },
  {
    title: "Polo TypeScript",
    imgSrc: "/images/polos/polo-ts.png",
    price: 20.0,
    description:
      "Tipa tu estilo con precisión: lleva tu pasión por TypeScript en cada hilo.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Logo de TypeScript estampado en alta calidad.",
      "Tejido antimanchas y duradero.",
      "Cuello reforzado que mantiene su forma.",
      "100% algodón hipoalergénico.",
    ],
  },
  {
    title: "Polo Backend Developer",
    imgSrc: "/images/polos/polo-backend.png",
    price: 25.0,
    description:
      "Domina el servidor con estilo: viste con orgullo tu título de Backend Developer.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Diseño exclusivo para desarrolladores backend.",
      "Material premium que mantiene su forma.",
      "Costuras reforzadas en puntos de tensión.",
      "Estampado de alta durabilidad.",
    ],
  },
  {
    title: "Polo Frontend Developer",
    imgSrc: "/images/polos/polo-frontend.png",
    price: 25.0,
    description:
      "Construye experiencias con estilo: luce con orgullo tu polo de Frontend Developer.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Diseño inspirado en elementos de UI/UX.",
      "Tela suave y ligera perfecta para el día a día.",
      "Estampado flexible que no se agrieta.",
      "Acabado profesional en cada detalle.",
    ],
  },
  {
    title: "Polo Full-Stack Developer",
    imgSrc: "/images/polos/polo-fullstack.png",
    price: 25.0,
    description:
      "Domina ambos mundos con estilo: lleva tu título de FullStack Developer en cada línea de tu look.",
    categoryId: 1,
    isOnSale: false,
    features: [
      "Diseño que representa ambos mundos del desarrollo.",
      "Material premium de larga duración.",
      "Proceso de estampado ecológico.",
      "Corte moderno y cómodo.",
    ],
  },
  {
    title: "Polo It's A Feature",
    imgSrc: "/images/polos/polo-feature.png",
    price: 15.0,
    description:
      "Cuando el bug se convierte en arte: lleva con orgullo tu polo 'It's a feature'.",
    categoryId: 1,
    isOnSale: true,
    features: [
      "Estampado humorístico de alta calidad.",
      "Algodón orgánico certificado.",
      "Diseño exclusivo de la comunidad dev.",
      "Disponible en múltiples colores.",
    ],
  },
  {
    title: "Polo It Works On My Machine",
    imgSrc: "/images/polos/polo-works.png",
    price: 15.0,
    description:
      "El clásico del desarrollador: presume tu confianza con 'It works on my machine'.",
    categoryId: 1,
    isOnSale: true,
    features: [
      "Frase icónica del mundo del desarrollo.",
      "Material durable y cómodo.",
      "Estampado que no se desvanece.",
      "Ideal para regalo entre desarrolladores.",
    ],
  },
  {
    title: "Sticker JavaScript",
    imgSrc: "/images/stickers/sticker-js.png",
    price: 2.99,
    description:
      "Muestra tu amor por JavaScript con este elegante sticker clásico.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker React",
    imgSrc: "/images/stickers/sticker-react.png",
    price: 2.49,
    description:
      "Decora tus dispositivos con el icónico átomo giratorio de React.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker Git",
    imgSrc: "/images/stickers/sticker-git.png",
    price: 3.99,
    description:
      "Visualiza el poder del control de versiones con este sticker de Git.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker Docker",
    imgSrc: "/images/stickers/sticker-docker.png",
    price: 2.99,
    description:
      "La adorable ballena de Docker llevando contenedores en un sticker único.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker Linux",
    imgSrc: "/images/stickers/sticker-linux.png",
    price: 2.49,
    description:
      "El querido pingüino Tux, mascota oficial de Linux, en formato sticker.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker VS Code",
    imgSrc: "/images/stickers/sticker-vscode.png",
    price: 2.49,
    description: "El elegante logo del editor favorito de los desarrolladores.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker GitHub",
    imgSrc: "/images/stickers/sticker-github.png",
    price: 2.99,
    description:
      "El alojamiento de repositorios más popular en un sticker de alta calidad.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Sticker HTML",
    imgSrc: "/images/stickers/sticker-html.png",
    price: 2.99,
    description:
      "El escudo naranja de HTML5, el lenguaje que estructura la web.",
    categoryId: 3,
    isOnSale: false,
    features: [
      "Vinilo de alta calidad resistente al agua",
      "Adhesivo duradero que no deja residuos",
      "Colores vibrantes que no se desvanecen",
      "Tamaño perfecto para laptops y dispositivos",
    ],
  },
  {
    title: "Taza JavaScript",
    imgSrc: "/images/tazas/taza-js.png",
    price: 14.99,
    description:
      "Disfruta tu café mientras programas con el logo de JavaScript.",
    categoryId: 2,
    isOnSale: false,
    features: [
      "Cerámica de alta calidad",
      "Apta para microondas y lavavajillas",
      "Capacidad de 325ml",
      "Diseño que no pierde color con el uso",
    ],
  },
  {
    title: "Taza React",
    imgSrc: "/images/tazas/taza-react.png",
    price: 13.99,
    description:
      "Una taza que hace render de tu bebida favorita con estilo React.",
    categoryId: 2,
    isOnSale: false,
    features: [
      "Cerámica de alta calidad",
      "Apta para microondas y lavavajillas",
      "Capacidad de 325ml",
      "Diseño que no pierde color con el uso",
    ],
  },
  {
    title: "Taza Git",
    imgSrc: "/images/tazas/taza-git.png",
    price: 12.99,
    description: "Commit a tu rutina diaria de café con esta taza de Git.",
    categoryId: 2,
    isOnSale: false,
    features: [
      "Cerámica de alta calidad",
      "Apta para microondas y lavavajillas",
      "Capacidad de 325ml",
      "Diseño que no pierde color con el uso",
    ],
  },
  {
    title: "Taza SQL",
    imgSrc: "/images/tazas/taza-sql.png",
    price: 15.99,
    description: "Tu amor por los lenguajes estructurados en una taza de SQL.",
    categoryId: 2,
    isOnSale: false,
    features: [
      "Cerámica de alta calidad",
      "Apta para microondas y lavavajillas",
      "Capacidad de 325ml",
      "Diseño que no pierde color con el uso",
    ],
  },
  {
    title: "Taza Linux",
    imgSrc: "/images/tazas/taza-linux.png",
    price: 13.99,
    description: "Toma tu café con la libertad que solo Linux puede ofrecer.",
    categoryId: 2,
    isOnSale: false,
    features: [
      "Cerámica de alta calidad",
      "Apta para microondas y lavavajillas",
      "Capacidad de 325ml",
      "Diseño que no pierde color con el uso",
    ],
  },
  {
    title: "Taza GitHub",
    imgSrc: "/images/tazas/taza-github.png",
    price: 14.99,
    description: "Colabora con tu café en esta taza con el logo de GitHub.",
    categoryId: 2,
    isOnSale: false,
    features: [
      "Cerámica de alta calidad",
      "Apta para microondas y lavavajillas",
      "Capacidad de 325ml",
      "Diseño que no pierde color con el uso",
    ],
  },
];
