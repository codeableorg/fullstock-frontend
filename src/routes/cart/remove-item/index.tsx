import { ActionFunctionArgs, redirect } from "react-router";

import { removeFromCart } from "@/lib/cart";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const itemId = Number(formData.get("itemId"));
  const redirectTo = formData.get("redirectTo") as string | null;

  await removeFromCart(itemId);

  return redirect(redirectTo || "/cart");
}
