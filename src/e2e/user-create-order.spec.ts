import { test, expect } from "@playwright/test";

import { prisma } from "@/db/prisma";
import { hashPassword } from "@/lib/security";
import type { CreateUserDTO } from "@/models/user.model";

import { baseUrl, cleanDatabase, creditCards } from "./utils-tests-e2e";

test.beforeEach(async () => {
  await cleanDatabase();
});

test.describe("User", () => {
  test.beforeEach(async () => {
    const testUser: CreateUserDTO = {
      email: "diego@codeable.com",
      name: null,
      password: await hashPassword("letmein"),
      isGuest: false,
    };

    console.log("Creating test user:", testUser);

    const user = await prisma.user.create({
      data: testUser,
    });

    console.log("Test user created:", user);
  });

  test("User can create an order", async ({ page }) => {
    await page.goto(baseUrl);

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

    const checkoutFrame = page.locator('iframe[name="checkout_frame"]');
    await expect(checkoutFrame).toBeVisible();

    const validCard = creditCards.valid;

    await checkoutFrame
      .contentFrame()
      .getByRole("textbox", { name: "#### #### #### ####" })
      .fill(validCard.number);

    await expect(
      checkoutFrame.contentFrame().getByRole("img", { name: "Culqi icon" })
    ).toBeVisible();

    await checkoutFrame
      .contentFrame()
      .getByRole("textbox", { name: "MM/AA" })
      .fill(validCard.exp);

    await checkoutFrame
      .contentFrame()
      .getByRole("textbox", { name: "CVV" })
      .fill(validCard.cvv);

    await checkoutFrame
      .contentFrame()
      .getByRole("textbox", { name: "correo@electronico.com" })
      .fill(loginForm["Correo electrónico"]);

    await checkoutFrame
      .contentFrame()
      .getByRole("button", { name: "Pagar S/" })
      .click();

    await expect(page.getByText("¡Muchas gracias por tu compra!")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId("orderId")).toBeVisible();
  });
});
