import { redirect } from "react-router";

import { addToCart } from "@/lib/cart";
import { getCartIdFromSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo") as string | null;

  const sessionCartId = await getCartIdFromSession(request)

  await addToCart(request, productId, quantity, sessionCartId);

  return redirect(redirectTo || "/cart", {
    headers: {
      "X-Remix-Revalidate": "root", // Indicar a React Router que debe revalidar la ruta raíz
    }
  });
}
