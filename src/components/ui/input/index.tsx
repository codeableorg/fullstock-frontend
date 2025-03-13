import * as React from "react";

import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface InputProps extends React.ComponentProps<"input"> {
  register: any;
  name: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, name, register, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        {...register(name)}
        className={cn(styles.input, className)}
        ref={ref}
        {...props}
      />
      {error && <p>{error}</p>}
    );
  }
);
Input.displayName = "Input";

export { Input };
