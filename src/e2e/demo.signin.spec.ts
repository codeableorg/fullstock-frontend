import { test, expect } from "@playwright/test";

test.describe("Visitante inicio sesion", () => {
  test("test", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.getByTestId("login").click();
    await page.getByRole("textbox", { name: "Correo electrónico" }).click();
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill("diego@codeable.com");
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .press("Tab");
    await page.getByRole("textbox", { name: "Contraseña" }).fill("letmein");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page.getByText("Bienvenido diego@codeable.com")).toBeVisible();
  });
});
