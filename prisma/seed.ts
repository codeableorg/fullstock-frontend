import { categories, products, variantAttributes, variantAttributeValues } from "./initial_data";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

async function seedDb() {
  await prisma.category.createMany({
    data: categories,
  });
  console.log("1. Categories successfully inserted");

  await prisma.variantAttribute.createMany({
    data: variantAttributes,
  })
  console.log("2. Variant Attributes successfully inserted");

  await prisma.product.createMany({
    data: products,

  });
  console.log("3. Products successfully inserted");

  await prisma.variantAttributeValue.createMany({
    data: variantAttributeValues,
  })

  console.log("4. Variant Attribute Values successfully inserted");

}

seedDb()
  .catch((e) => {
    console.error("Seeding error:", e);
  })
  .finally(async () => {
    console.log("--- Database seeded successfully. ---");
    await prisma.$disconnect();
  });
