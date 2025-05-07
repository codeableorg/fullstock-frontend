import { redirect } from "react-router";

import { destroySession, getSession } from "@/session.server";

import type { Route } from "./+types";

export async function action({ request }: Route.ActionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
