import { redirect } from "react-router";

import { addToCart } from "@/lib/cart";

import type { Route } from "../+types";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo") as string | null;

  await addToCart(productId, quantity);

  return redirect(redirectTo || "/cart");
}
