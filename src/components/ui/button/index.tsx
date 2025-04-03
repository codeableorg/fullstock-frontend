import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?:
    | "default"
    | "sm"
    | "lg"
    | "xl"
    | "sm-icon"
    | "icon"
    | "lg-icon"
    | "xl-icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    const defaultClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:w-4 [&>svg]:h-4 [&>svg]:flex-shrink-0";

    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary-hover",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
      outline:
        "text-muted-foreground border border-border bg-background hover:bg-muted",
      ghost: "text-muted-foreground bg-transparent hover:bg-muted",
    };

    const sizeClasses = {
      default: "h-8 py-1.5 px-2.5",
      sm: "h-6 rounded-md py-1 px-2",
      lg: "h-10 rounded-lg py-2.5 px-3.5",
      xl: "h-12 rounded-lg py-3 px-8 text-base [&>svg]:w-5 [&>svg]:h-5",
      "sm-icon": "h-7 w-7 cursor-pointer [&>svg]:w-5 [&>svg]:h-5",
      icon: "h-8 w-8 [&>svg]:w-5 [&>svg]:h-5",
      "lg-icon": "h-9 w-9 [&>svg]:w-5 [&>svg]:h-5",
      "xl-icon": "h-10 w-10 [&>svg]:w-6 [&>svg]:h-6",
    };

    return (
      <Comp
        className={cn(
          defaultClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
