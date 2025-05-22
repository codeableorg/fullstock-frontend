import { redirect } from "react-router";

import { removeFromCart } from "@/lib/cart";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const itemId = Number(formData.get("itemId"));
  const redirectTo = formData.get("redirectTo") as string | null;

  await removeFromCart(request, itemId);

  return redirect(redirectTo || "/cart");
}
