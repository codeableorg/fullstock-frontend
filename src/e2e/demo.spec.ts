import { test, expect } from "@playwright/test";

test.describe("Visitor", () => {
  test("can add a product to the cart", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    await expect(page).toHaveTitle(/inicio/i);

    await page.getByRole("menuitem", { name: "Polos", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Polos" })).toBeVisible();

    await page.getByTestId("product-item").first().click();
    const button = page.getByRole("button", {
      name: "Agregar al Carrito",
    });
    await expect(button).toBeVisible();
    await button.click();
    const cartCount = page.getByTestId("cart-count");
    await expect(cartCount).toHaveText("1");
  });
});
