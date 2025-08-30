import { redirect } from "react-router";

import { addToCart } from "@/lib/cart";
import { getSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const attributeValueId = Number(formData.get("attributeValueId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo") as string | null;
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  await addToCart(userId, sessionCartId, attributeValueId, quantity);

  return redirect(redirectTo || "/cart");
}
