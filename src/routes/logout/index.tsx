import { redirect } from "react-router";

import { removeToken } from "@/lib/utils";

export function action() {
  removeToken();
  return redirect("/");
}
