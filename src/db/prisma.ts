import { PrismaClient } from "generated/prisma";

// Global variable to store the Prisma client instance
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Create a singleton instance of PrismaClient
// In development, this prevents multiple instances from being created
// during hot reloads, which can cause connection issues
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

export { prisma };

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});
