import * as React from "react";

import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

export function Container({
  children,
  className,
}: React.PropsWithChildren<React.ComponentPropsWithoutRef<"div">>) {
  return <div className={cn(styles.container, className)}>{children}</div>;
}
