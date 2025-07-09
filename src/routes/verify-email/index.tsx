import { verifyUniqueEmail } from "@/services/user.service";

import type { Route } from "./+types";

export async function loader({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (email) {
    const response = await verifyUniqueEmail(email);
    return response;
  }
  return false;
}
