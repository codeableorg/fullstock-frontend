import { test, expect } from "@playwright/test";

import {
  baseUrl,
  cleanDatabase,
  createOrderFormData,
  creditCards,
} from "./utils-tests-e2e";

test.beforeEach(async () => {
  await cleanDatabase();
});

test.describe("Cart with product variants", () => {
  test("adds same product with different variants as separate items and completes checkout", async ({
    page,
  }) => {
    await page.goto(baseUrl);

    // Ir a Stickers y abrir un producto
    await page.getByRole("menuitem", { name: "Stickers", exact: true }).click();
    await page.getByTestId("product-item").first().click();

    // Seleccionar 3x3cm y agregar al carrito (permanece en la página del producto)
    await page.getByRole("button", { name: "3x3cm" }).click();
    await page.getByRole("button", { name: "Agregar al Carrito" }).click();

    // Seleccionar 10x10cm y agregar al carrito
    await page.getByRole("button", { name: "10x10cm" }).click();
    await page.getByRole("button", { name: "Agregar al Carrito" }).click();

    // Ir al carrito
    await page.getByRole("link", { name: "Carrito de compras" }).click();

    // Verificar que ambas variantes están separadas
    const itemRows = page
      .locator("div.border-b")
      .filter({ hasText: "Sticker" });
    await expect(itemRows).toHaveCount(2);

    // Verificar nombres con variante
    const firstRowText = await itemRows.nth(0).innerText();
    const secondRowText = await itemRows.nth(1).innerText();
    expect(firstRowText).toMatch(/\(\s*3x3cm\s*\)/);
    expect(secondRowText).toMatch(/\(\s*10x10cm\s*\)/);

    // Capturar precios unitarios de cada fila
    const getUnitPrice = async (rowIdx: number) => {
      const priceText = await itemRows
        .nth(rowIdx)
        .locator("p.text-sm.font-medium")
        .innerText();
      // "S/9.95" -> 9.95
      return parseFloat(priceText.replace(/[^\d.]/g, ""));
    };
    const price1 = await getUnitPrice(0);
    const price2 = await getUnitPrice(1);

    // Verificar total = suma de ambos (cada uno con cantidad 1)
    const totalTextBefore = await page
      .locator("div:has-text('Total') >> nth=1")
      .locator("p")
      .last()
      .innerText();
    const currentTotal = parseFloat(totalTextBefore.replace(/[^\d.]/g, ""));
    expect(currentTotal).toBeCloseTo(price1 + price2, 2);

    // Incrementar cantidad SOLO del primer ítem (usar el segundo form de la primera fila)
    const addItemForms = page.locator('form[action="/cart/add-item"]');
    await addItemForms.nth(1).locator("button").click();

    // Verificar que el total aumentó en +price1
    const totalTextAfterInc = await page
      .locator("div:has-text('Total') >> nth=1")
      .locator("p")
      .last()
      .innerText();
    const newTotalAfterInc = parseFloat(
      totalTextAfterInc.replace(/[^\d.]/g, "")
    );
    expect(newTotalAfterInc).toBeCloseTo(currentTotal + price1, 2);

    // Eliminar el segundo ítem (botón con name=itemId, segundo de la lista)
    const removeButtons = page.locator('button[name="itemId"]');
    await removeButtons.nth(1).click();

    // Confirmar que queda 1 fila
    await expect(itemRows).toHaveCount(1);

    // Continuar compra
    await page.getByRole("link", { name: "Continuar Compra" }).click();

    // Completar checkout (flujo similar a tests existentes)
    const orderForm = createOrderFormData();
    for (const [label, value] of Object.entries(orderForm)) {
      await page.getByRole("textbox", { name: label }).fill(value);
    }
    await page.getByRole("combobox", { name: "País" }).selectOption("PE");
    await page.getByRole("button", { name: "Confirmar Orden" }).click();

    const checkoutFrame = page.locator('iframe[name="checkout_frame"]');
    await expect(checkoutFrame).toBeVisible({ timeout: 10000 });

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
