import { test, expect } from "@playwright/test";

import { hashPassword } from "@/lib/security";
import type { CreateUserDTO } from "@/models/user.model";
import {
  createUser,
  deleteUser,
  getUserByEmail,
} from "@/repositories/user.repository";

test.describe("User", () => {
  let testUserId: number;

  test.beforeAll(async () => {
    const testUser: CreateUserDTO = {
      email: "diego@codeable.com",
      name: null,
      password: await hashPassword("letmein"),
      isGuest: false,
    };

    const existingUser = await getUserByEmail(testUser.email);

    if (existingUser) {
      await deleteUser(existingUser.id);
    }

    const user = await createUser(testUser);
    testUserId = user.id;
  });

  test.afterAll(async () => {
    await deleteUser(testUserId);
  });

  test("User can create an order", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await page.getByRole("link", { name: "Iniciar sesión" }).click();

    const loginForm = {
      "Correo electrónico": "diego@codeable.com",
      Contraseña: "letmein",
    };

    for (const [key, value] of Object.entries(loginForm)) {
      const input = await page.getByRole("textbox", { name: key });
      await input.click();
      await input.fill(value);
    }

    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    // Wait for the user to be logged in
    await expect(
      page.getByRole("button", { name: "Cerrar sesión" })
    ).toBeVisible();

    await page.getByRole("menuitem", { name: "Polos" }).click();
    await page.getByTestId("product-item").first().click();

    await page.getByRole("button", { name: "Agregar al Carrito" }).click();
    await page.getByRole("link", { name: "Carrito de compras" }).click();

    await page.getByRole("link", { name: "Continuar Compra" }).click();

    const orderForm = {
      Nombre: "Testino",
      Apellido: "Diprueba",
      Compañia: "",
      Dirección: "Calle De Prueba 123",
      Ciudad: "Lima",
      "Provincia/Estado": "Lima",
      "Código Postal": "51111",
      Teléfono: "987456321",
    };

    for (const [key, value] of Object.entries(orderForm)) {
      const input = await page.getByRole("textbox", { name: key });
      await input.click();
      await input.fill(value);
    }

    await page.getByRole("combobox", { name: "País" }).selectOption("PE");

    await page.getByRole("button", { name: "Confirmar Orden" }).click();

    await expect(
      page.getByText("¡Muchas gracias por tu compra!")
    ).toBeVisible();
    await expect(page.getByTestId("orderId")).toBeVisible();
  });
});
