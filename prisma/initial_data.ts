import type { CategorySlug } from "../generated/prisma/client";

const imagesBaseUrl = "https://fullstock-images.s3.us-east-2.amazonaws.com";

export const categories = [
  {
    title: "Polos",
    slug: "polos" as CategorySlug,
    imgSrc: `${imagesBaseUrl}/polos.jpg`,
    alt: "Hombre luciendo polo azul",
    description:
      "Polos exclusivos con diseños que todo desarrollador querrá lucir. Ideales para llevar el código a donde vayas.",
  },
  {
    title: "Tazas",
    slug: "tazas" as CategorySlug,
    imgSrc: `${imagesBaseUrl}/tazas.jpg`,
    alt: "Tazas con diseño de código",
    description:
      "Tazas que combinan perfectamente con tu café matutino y tu pasión por la programación. ¡Empieza el día con estilo!",
  },
  {
    title: "Stickers",
    slug: "stickers" as CategorySlug,
    imgSrc: `${imagesBaseUrl}/stickers.jpg`,
    alt: "Stickers de desarrollo web",
    description:
      "Personaliza tu espacio de trabajo con nuestros stickers únicos y muestra tu amor por el desarrollo web.",
  },
];

export const variantAttributes = [
  { name: "talla" },
  { name: "dimensiones" },
  { name: "no aplica" },
]

export const products = [
  {
    title: "Polo React",
    imgSrc: `${imagesBaseUrl}/polos/polo-react.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-js.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-node.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-ts.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-backend.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-frontend.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-fullstack.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-feature.png`,
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
    imgSrc: `${imagesBaseUrl}/polos/polo-works.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-js.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-react.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-git.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-docker.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-linux.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-vscode.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-github.png`,
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
    imgSrc: `${imagesBaseUrl}/stickers/sticker-html.png`,
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
    imgSrc: `${imagesBaseUrl}/tazas/taza-js.png`,
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
    imgSrc: `${imagesBaseUrl}/tazas/taza-react.png`,
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
    imgSrc: `${imagesBaseUrl}/tazas/taza-git.png`,
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
    imgSrc: `${imagesBaseUrl}/tazas/taza-sql.png`,
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
    imgSrc: `${imagesBaseUrl}/tazas/taza-linux.png`,
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
    imgSrc: `${imagesBaseUrl}/tazas/taza-github.png`,
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

export const variantAttributeValues = [
  // --- POLOS (talla: S, M, L) ---
  { attributeId: 1, productId: 1, value: "S", price: 20.0 },
  { attributeId: 1, productId: 1, value: "M", price: 20.0 },
  { attributeId: 1, productId: 1, value: "L", price: 20.0 },

  { attributeId: 1, productId: 2, value: "S", price: 20.0 },
  { attributeId: 1, productId: 2, value: "M", price: 20.0 },
  { attributeId: 1, productId: 2, value: "L", price: 20.0 },

  { attributeId: 1, productId: 3, value: "S", price: 20.0 },
  { attributeId: 1, productId: 3, value: "M", price: 20.0 },
  { attributeId: 1, productId: 3, value: "L", price: 20.0 },

  { attributeId: 1, productId: 4, value: "S", price: 20.0 },
  { attributeId: 1, productId: 4, value: "M", price: 20.0 },
  { attributeId: 1, productId: 4, value: "L", price: 20.0 },

  { attributeId: 1, productId: 5, value: "S", price: 25.0 },
  { attributeId: 1, productId: 5, value: "M", price: 25.0 },
  { attributeId: 1, productId: 5, value: "L", price: 25.0 },

  { attributeId: 1, productId: 6, value: "S", price: 25.0 },
  { attributeId: 1, productId: 6, value: "M", price: 25.0 },
  { attributeId: 1, productId: 6, value: "L", price: 25.0 },

  { attributeId: 1, productId: 7, value: "S", price: 25.0 },
  { attributeId: 1, productId: 7, value: "M", price: 25.0 },
  { attributeId: 1, productId: 7, value: "L", price: 25.0 },

  { attributeId: 1, productId: 8, value: "S", price: 15.0 },
  { attributeId: 1, productId: 8, value: "M", price: 15.0 },
  { attributeId: 1, productId: 8, value: "L", price: 15.0 },

  { attributeId: 1, productId: 9, value: "S", price: 15.0 },
  { attributeId: 1, productId: 9, value: "M", price: 15.0 },
  { attributeId: 1, productId: 9, value: "L", price: 15.0 },

  // --- STICKERS (dimensiones: 3x3, 6x6, 9x9) ---
  { attributeId: 2, productId: 10, value: "3x3", price: 2.99 },
  { attributeId: 2, productId: 10, value: "5x5", price: 3.99 },
  { attributeId: 2, productId: 10, value: "10x10", price: 4.99 },

  { attributeId: 2, productId: 11, value: "3x3", price: 2.49 },
  { attributeId: 2, productId: 11, value: "5x5", price: 3.49 },
  { attributeId: 2, productId: 11, value: "10x10", price: 4.49 },

  { attributeId: 2, productId: 12, value: "3x3", price: 3.99 },
  { attributeId: 2, productId: 12, value: "5x5", price: 4.99 },
  { attributeId: 2, productId: 12, value: "10x10", price: 5.99 },

  { attributeId: 2, productId: 13, value: "3x3", price: 2.99 },
  { attributeId: 2, productId: 13, value: "5x5", price: 3.99 },
  { attributeId: 2, productId: 13, value: "10x10", price: 4.99 },

  { attributeId: 2, productId: 14, value: "3x3", price: 2.49 },
  { attributeId: 2, productId: 14, value: "5x5", price: 3.49 },
  { attributeId: 2, productId: 14, value: "10x10", price: 4.49 },

  { attributeId: 2, productId: 15, value: "3x3", price: 2.49 },
  { attributeId: 2, productId: 15, value: "5x5", price: 3.49 },
  { attributeId: 2, productId: 15, value: "10x10", price: 4.49 },

  { attributeId: 2, productId: 16, value: "3x3", price: 2.99 },
  { attributeId: 2, productId: 16, value: "5x5", price: 3.99 },
  { attributeId: 2, productId: 16, value: "10x10", price: 4.99 },

  { attributeId: 2, productId: 17, value: "3x3", price: 2.99 },
  { attributeId: 2, productId: 17, value: "5x5", price: 3.99 },
  { attributeId: 2, productId: 17, value: "10x10", price: .99 },

  // --- TAZAS (no aplica: Único) ---
  { attributeId: 3, productId: 18, value: "Único", price: 14.99 },
  { attributeId: 3, productId: 19, value: "Único", price: 13.99 },
  { attributeId: 3, productId: 20, value: "Único", price: 12.99 },
  { attributeId: 3, productId: 21, value: "Único", price: 15.99 },
  { attributeId: 3, productId: 22, value: "Único", price: 13.99 },
  { attributeId: 3, productId: 23, value: "Único", price: 14.99 },
];