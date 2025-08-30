import { redirect } from "react-router";

import { prisma } from "@/db/prisma";
import { addToCart } from "@/lib/cart";
import { getSession } from "@/session.server";

import type { Route } from "../+types";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const productId = Number(formData.get("productId"));
  const quantity = Number(formData.get("quantity")) || 1;
  const size = formData.get("size") as string | undefined;
  const measure = formData.get("measure") as string | undefined;
  const redirectTo = formData.get("redirectTo") as string | null;
  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");
  const userId = session.get("userId");

  let productVariantId: number | undefined = undefined;
  let stickersVariantId: number | undefined = undefined;

  // Si hay talla, busca el variant correspondiente
  if (size) {
    const variant = await prisma.productVariant.findFirst({
      where: {
        productId,
        size,
      },
    });
    if (!variant) {
      return new Response(
  JSON.stringify({ error: "No se encontró la variante seleccionada." }),
  { status: 400, headers: { "Content-Type": "application/json" } }
);
    }
    productVariantId = variant.id;
  }

  // Si hay medida, busca el variant correspondiente
  if (measure) {
    const variantMeasure = await prisma.stickersVariant.findFirst({
      where: {
        productId,
        measure,
      },
    });
    if (!variantMeasure) {
      return new Response(
        JSON.stringify({ error: "No se encontró la variante de stickers seleccionada." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    stickersVariantId = variantMeasure.id;
  }

  await addToCart(userId, sessionCartId, productId, quantity, productVariantId, stickersVariantId);

  return redirect(redirectTo || "/cart");
}