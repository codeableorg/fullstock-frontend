import { ActionFunctionArgs, redirect } from "react-router";

import { addToCart } from "@/lib/cart";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));

  await addToCart(productId);

  return redirect(`/products/${productId}`);
}
