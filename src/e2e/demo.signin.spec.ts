import { test, expect } from "@playwright/test";

import { prisma } from "@/db/prisma";
import { hashPassword } from "@/lib/security";
import type { CreateUserDTO } from "@/models/user.model";

test.describe("Visitante inicio sesion", () => {
  let testUserId: number;

  test.beforeAll(async () => {
    const testUser: CreateUserDTO = {
      email: "diego@codeable.com",
      name: null,
      password: await hashPassword("letmein"),
      isGuest: false,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: testUser.email },
    });

    if (existingUser) {
      await prisma.user.delete({
        where: { id: existingUser.id },
      });
    }

    const user = await prisma.user.create({
      data: testUser,
    });
    testUserId = user.id;
  });

  test.afterAll(async () => {
    await prisma.user.delete({
      where: { id: testUserId },
    });
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
