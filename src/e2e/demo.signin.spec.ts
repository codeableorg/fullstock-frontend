import { test, expect } from "@playwright/test";

import { hashPassword } from "@/lib/security";
import type { CreateUserDTO } from "@/models/user.model";
import {
  createUser,
  deleteUser,
  getUserByEmail,
} from "@/repositories/user.repository";

test.describe("Visitante inicio sesion", () => {
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
