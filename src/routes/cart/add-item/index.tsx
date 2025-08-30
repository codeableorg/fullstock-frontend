import { redirect } from "react-router";

import { addToCart } from "@/lib/cart";
import { getSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo") as string | null;
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  await addToCart(userId, sessionCartId, productId, quantity);

  return redirect(redirectTo || "/cart");
}
