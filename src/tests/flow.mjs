import { expect } from "@playwright/test";

const creditCards = {
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

const createOrderFormData = (overrides) => ({
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

export async function guestUserPurchase(page) {
  // console.log(page);
  // Navegar a la tienda y agregar un producto
  await page.goto(process.env.BASE_URL);

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

  await expect(
    await checkoutFrame.contentFrame().getByRole("button", { name: "Pagar S/" })
  ).toBeEnabled();

  await checkoutFrame
    .contentFrame()
    .getByRole("button", { name: "Pagar S/" })
    .click();

  await expect(page.getByText("¡Muchas gracias por tu compra!")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByTestId("orderId")).toBeVisible();
}
