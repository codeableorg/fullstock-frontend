import { redirect } from "react-router";

import { addToCart } from "@/lib/cart";

import type { Route } from "../+types";
import { commitSession, getSession } from "@/session.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const redirectTo = formData.get("redirectTo") as string | null;

  await addToCart(productId, quantity, request);

  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  return redirect(redirectTo || "/cart", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
