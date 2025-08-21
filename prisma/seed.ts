import { categories, categoryVariants, products } from "./initial_data";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function seedDb() {
  await prisma.orderItem.deleteMany();
  console.log("  ✅ OrderItems eliminados");

  await prisma.cart.deleteMany();
  console.log("  ✅ Carts eliminados");

  await prisma.cartItem.deleteMany();
  console.log("  ✅ CartItems eliminados");

  await prisma.categoryVariant.deleteMany();
  console.log("  ✅ CategoryVariants eliminados");

  await prisma.product.deleteMany();
  console.log("  ✅ Products eliminados");

  await prisma.category.deleteMany();
  console.log("  ✅ Categories eliminadas");

  await prisma.category.createMany({
    data: categories,
  });
  console.log("1. Categories successfully inserted");

  await prisma.categoryVariant.createMany({
    data: categoryVariants,
  });
  console.log("2. Category variants successfully inserted");

  await prisma.product.createMany({
    data: products,
  });
  console.log("3. Products successfully inserted");
}

seedDb()
  .catch((e) => {
    console.error("Seeding error:", e);
  })
  .finally(async () => {
    console.log("--- Database seeded successfully. ---");
    await prisma.$disconnect();
  });
