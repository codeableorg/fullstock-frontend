import React from "react";

import { cn } from "@/lib/utils";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
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
