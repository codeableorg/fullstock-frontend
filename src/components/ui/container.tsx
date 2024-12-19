import clsx from "clsx";
import * as React from "react";

export function Container({
  children,
  className,
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<"div">>) {
  const classes = clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className);

  return <div className={classes}>{children}</div>;
}
