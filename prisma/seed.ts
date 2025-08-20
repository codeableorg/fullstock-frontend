import { categories, products } from "./initial_data";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

// Define las tallas para los productos tipo "Polo"
const poloSizes = ["small", "medium", "large"] as const;

async function seedDb() {
  // Limpia las tablas para evitar duplicados
  await prisma.productVariant.deleteMany();
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
}

seedDb()
  .catch((e) => {
    console.error("Seeding error:", e);
  })
  .finally(async () => {
    console.log("--- Database seeded successfully. ---");
    await prisma.$disconnect();
  });