import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../input";
import { Label } from "../label";
import styles from "./styles.module.css";

interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id: providedId, error, className, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const hasError = Boolean(error);

    const inputClasses = cn(className, {
      [styles["input-field--error"]]: hasError,
    });

    return (
      <div className={styles["input-field"]}>
        <Label htmlFor={id}>{label}</Label>
        <Input ref={ref} id={id} className={inputClasses} {...props} />
        {hasError && (
          <div className={styles["input-field__error"]}>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
