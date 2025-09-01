import { categories, products, productVariants } from "./initial_data";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function seedDb() {
  await prisma.category.createMany({
    data: categories,
  });
  console.log("1. Categories successfully inserted");

  for ( const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    })

    //Tazas no tienen variantes
    if(createdProduct.categoryId !== 2) {
      await prisma.productVariant.createMany({
        data: productVariants(createdProduct),
      });
    }
  }
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
