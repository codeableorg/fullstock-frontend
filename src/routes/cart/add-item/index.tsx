import { redirect } from "react-router";

import { addToCart } from "@/lib/cart";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo") as string | null;

  const result = await addToCart(productId, quantity, request);

  return redirect(redirectTo || "/cart", {
    headers: result?.headers || undefined,
  });
}
