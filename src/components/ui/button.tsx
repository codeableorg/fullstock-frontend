import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        outline:
          "text-muted-foreground border border-border bg-background hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-muted",
      },
      size: {
        default: "h-8 px-2.5 py-1.5",
        sm: "h-6 rounded-md px-2 py-1",
        lg: "h-10 rounded-lg px-3.5 py-2.5",
        xl: "h-12 rounded-lg px-8 py-3 text-base [&_svg]:size-5",
        "sm-icon": "h-7 w-7 [&_svg]:size-5",
        icon: "h-8 w-8 [&_svg]:size-5",
        "lg-icon": "h-9 w-9 [&_svg]:size-5",
        "xl-icon": "h-10 w-10 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
