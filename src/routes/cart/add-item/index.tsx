import { redirect } from "react-router";
import { prisma } from "@/db/prisma";
import { addToCart } from "@/lib/cart";
import { getSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  //const size = formData.get("size") as string | undefined;
  const redirectTo = formData.get("redirectTo") as string | null;
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  const variantId = formData.get("variantId");
let productVariantId: number | undefined = undefined;

if (variantId) {
  productVariantId = Number(variantId);
}

  await addToCart(userId, sessionCartId, productId, quantity, productVariantId);

  return redirect(redirectTo || "/cart");
}