/* Helper functions → Playwright */

import { prisma } from "@/db/prisma";

export type OrderFormData = Record<string, string>;

export const createOrderFormData = (
  overrides?: Partial<OrderFormData>
): OrderFormData => ({
  "Correo electrónico": "testinodp@codeable.com",
  Nombre: "Testino",
  Apellido: "Diprueba",
  Compañia: "",
  Dirección: "Calle Di Prueba 123",
  Ciudad: "Lima",
  "Provincia/Estado": "Lima",
  "Código Postal": "51111",
  Teléfono: "987456321",
  ...overrides,
});

export const creditCards = {
  valid: {
    number: "4111 1111 1111 1111",
    exp: "12/30",
    cvv: "123",
  },
  declined: {
    number: "4000 0200 0000 0000",
    exp: "12/30",
    cvv: "354",
  },
};

export async function cleanDatabase() {
  await prisma.order.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.user.deleteMany();

  // Mantenemos product y category
}

export const baseUrl = process.env.CI
  ? "http://localhost:3000/"
  : "http://localhost:5173/";

export const command = process.env.CI ? "npm run start" : "npm run dev";
