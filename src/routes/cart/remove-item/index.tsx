import { redirect } from "react-router";

import { removeFromCart } from "@/lib/cart";
import { getSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const itemId = Number(formData.get("itemId"));
  const redirectTo = formData.get("redirectTo") as string | null;
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  await removeFromCart(userId, sessionCartId, itemId);

  return redirect(redirectTo || "/cart");
}
