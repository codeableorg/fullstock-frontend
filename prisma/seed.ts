import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function seedDb() {
  await prisma.user.create({
    data: {
      email: "testino@mail.com",
    },
  });
}

seedDb().then(() => {
  console.log("Database seeded successfully.");
  prisma.$disconnect();
});
