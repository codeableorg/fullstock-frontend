import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border border-solid border-border bg-background py-2 px-3 text-base focus-visible:outline-2 focus-visible:outline focus-visible:outline-ring focus-visible:outline-offset-2 [&::file-selector-button]:border-0 [&::file-selector-button]:bg-transparent [&::file-selector-button]:text-sm [&::file-selector-button]:font-medium [&::file-selector-button]:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };