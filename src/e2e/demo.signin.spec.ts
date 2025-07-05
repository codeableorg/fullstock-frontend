import { test, expect } from "@playwright/test";

import { prisma } from "@/db/prisma";
import { hashPassword } from "@/lib/security";
import type { CreateUserDTO } from "@/models/user.model";

import { baseUrl, cleanDatabase } from "./utils-tests-e2e";

test.beforeEach(async () => {
  await cleanDatabase();
});

test.describe("Visitante inicio sesion", () => {
  test.beforeEach(async () => {
    const testUser: CreateUserDTO = {
      email: "diego@codeable.com",
      name: null,
      password: await hashPassword("letmein"),
      isGuest: false,
    };

    await prisma.user.create({
      data: testUser,
    });
  });

  test("test", async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByTestId("login").click();
    await page.getByRole("textbox", { name: "Correo electrónico" }).click();
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill("diego@codeable.com");

    await page.getByRole("textbox", { name: "Contraseña" }).fill("letmein");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page.getByText("Bienvenido diego@codeable.com")).toBeVisible();
  });
});
