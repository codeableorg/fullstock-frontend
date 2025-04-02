import * as React from "react";
import { cn } from "@/lib/utils";

import { cva, VariantProps } from "class-variance-authority";

const selectVariants = cva(
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm",
  {
    variants: {
      variant: {
        default: "text-foreground",
        disabled: "cursor-not-allowed opacity-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SelectProps
  extends React.ComponentPropsWithoutRef<"select">,
    VariantProps<typeof selectVariants> {
  asChild?: boolean;
}

const Select = React.forwardRef<React.ElementRef<"select">, SelectProps>(
  ({ className, variant, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(selectVariants({ variant }), className)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "BasicSelect";

const Option = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement>
>(({ children, ...props }, ref) => (
  <option ref={ref} {...props}>
    {children}
  </option>
));
Option.displayName = "BasicOption";

export { Select, Option };
