import { categories, products } from "./initial_data";
import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

async function seedDb() {
  await prisma.category.createMany({
    data: categories,
  });
  console.log("1. Categories successfully inserted");

  await prisma.product.createMany({
    data: products,
  });
  console.log("2. Products successfully inserted");
}

seedDb()
  .catch((e) => {
    console.error("Seeding error:", e);
  })
  .finally(async () => {
    console.log("--- Database seeded successfully. ---");
    await prisma.$disconnect();
  });
