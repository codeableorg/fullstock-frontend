import * as React from "react";

import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentPropsWithoutRef<"div"> {
  maxWidth: string;
}

export function Container({
  children,
  className,
  maxWidth = '7xl'
}: React.PropsWithChildren<ContainerProps>) {
  return <div className={cn(`max-w-${maxWidth} mx-auto px-4 sm:px-6 lg:px-8`, className)}>{children}</div>;
}
