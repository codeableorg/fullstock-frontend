import { categories, products } from "./initial_data";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

// Define las tallas para los productos tipo "Polo"
const poloSizes = ["small", "medium", "large"] as const;
// Define el tamaño para los productos tipo "Stickers"
const stickerMeasures = ["3*3", "5*5", "10*10"] as const;

async function seedDb() {
  // Limpia las tablas para evitar duplicados
  await prisma.productVariant.deleteMany();
  await prisma.stickersVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Inserta categorías
  await prisma.category.createMany({
    data: categories,
  });
  console.log("1. Categories successfully inserted");

  // Inserta productos
  await prisma.product.createMany({
    data: products,
  });
  console.log("2. Products successfully inserted");

  // Obtiene los productos tipo "Polo" para agregar variantes
  const polosCategory = await prisma.category.findUnique({
    where: { slug: "polos" },
  });

  if (polosCategory) {
    const polos = await prisma.product.findMany({
      where: { categoryId: polosCategory.id },
    });

    for (const polo of polos) {
      for (const size of poloSizes) {
        await prisma.productVariant.create({
          data: {
            productId: polo.id,
            size,
          },
        });
      }
    }
    console.log("3. Polo variants successfully inserted");
  }

  // Obtiene los productos tipo "Stickers" para agregar variantes
  const stickersCategory = await prisma.category.findUnique({
    where: { slug: "stickers" },
  });
  if (stickersCategory) {
    const stickers = await prisma.product.findMany({
      where: { categoryId: stickersCategory.id },
    });

    const stickerPrices: Record<typeof stickerMeasures[number], number> = {
      "3*3": 2.99,
      "5*5": 5.99,
      "10*10": 8.99,
    };

    for (const sticker of stickers) {
      for (const measure of stickerMeasures) {
        await prisma.stickersVariant.create({
          data: {
            productId: sticker.id,
            measure,
            price: stickerPrices[measure], // Asigna el precio según la medida
          },
        });
      }
    }
    console.log("4. Stickers variants successfully inserted");
  }
}

seedDb()
  .catch((e) => {
    console.error("Seeding error:", e);
  })
  .finally(async () => {
    console.log("--- Database seeded successfully. ---");
    await prisma.$disconnect();
  });