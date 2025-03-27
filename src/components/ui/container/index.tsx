import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<"div">>) {
  return (
    <div className={cn(`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl`, className)}>
      {children}
    </div>
  );
}
