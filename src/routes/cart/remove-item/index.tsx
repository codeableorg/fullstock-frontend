import { redirect } from "react-router";

import { removeFromCart } from "@/lib/cart";
import { getCartIdFromSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const itemId = Number(formData.get("itemId"));
  const redirectTo = formData.get("redirectTo") as string | null;

  const sessionCartId = await getCartIdFromSession(request)
  console.log('sessionCartId', sessionCartId);

  await removeFromCart(request, itemId, sessionCartId);

  return redirect(redirectTo || "/cart");
}
