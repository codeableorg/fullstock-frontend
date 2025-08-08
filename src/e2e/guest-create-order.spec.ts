// import { createOrderFormData } from "@/lib/utils.tests";
import { expect, test } from "@playwright/test";

import {
  baseUrl,
  cleanDatabase,
  createOrderFormData,
  creditCards,
} from "./utils-tests-e2e";

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
      .fill(orderForm["Correo electrónico"]);

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
