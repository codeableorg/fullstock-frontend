import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<"div">>) {
  const classes = cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className);

  return <div className={classes}>{children}</div>;
}
