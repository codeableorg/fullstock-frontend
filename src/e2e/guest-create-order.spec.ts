// import { createOrderFormData } from "@/lib/utils.tests";
import { expect, test } from "@playwright/test";

import { baseUrl, cleanDatabase, createOrderFormData } from "./utils-tests-e2e";

export type OrderFormData = Record<string, string>;

test.beforeEach(async () => {
  await cleanDatabase();
});

test.describe("Guest", () => {
  test("Guest can create an order", async ({ page }) => {
    // Navegar a la tienda y agregar un producto
    await page.goto(baseUrl);

    await page.getByRole("menuitem", { name: "Polos" }).click();
    await page.getByTestId("product-item").first().click();

    await page.getByRole("button", { name: "Agregar al Carrito" }).click();
    await page.getByRole("link", { name: "Carrito de compras" }).click();

    await page.getByRole("link", { name: "Continuar Compra" }).click();

    // Llenar correctamente los campos
    const orderForm = createOrderFormData();
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
