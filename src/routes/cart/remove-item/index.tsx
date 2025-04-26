import { removeFromCart } from "@/lib/cart";
import { redirect } from "react-router";
import type { Route } from "../+types";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const itemId = Number(formData.get("itemId"));
  const redirectTo = formData.get("redirectTo") as string | null;

  await removeFromCart(itemId);

  return redirect(redirectTo || "/cart");
}
