import { redirect } from "react-router";

import { removeToken } from "@/lib/utils";

export function clientAction() {
  removeToken();
  return redirect("/");
}
