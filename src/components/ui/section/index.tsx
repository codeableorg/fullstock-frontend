import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const sectionVariants = cva("", {
  variants: {
    padding: {
      default: "py-12 md:py-16",
      none: "py-0",
      sm: "py-6 md:py-8",
      lg: "py-16 md:py-20",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

interface SectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
}

export function Section({ 
  className, 
  children, 
  padding,
  ...props 
}: SectionProps) {
  return (
    <section 
      className={cn(sectionVariants({ padding, className }))} 
      {...props}
    >
      {children}
    </section>
  );
}

export { type SectionProps, sectionVariants };