import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none", {
  variants: {
    variant: {
      default: "text-foreground",
      error: "text-destructive",
      muted: "text-muted-foreground",
      disabled: "cursor-not-allowed opacity-70",
    },
    size: {
      default: "text-sm",
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  asChild?: boolean;
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>,LabelProps>(
  ({ className, variant, size, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size, className }))}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, type LabelProps, labelVariants };
