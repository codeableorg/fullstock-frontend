import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn(styles.section, className)} {...props}>
      {children}
    </section>
  );
}
