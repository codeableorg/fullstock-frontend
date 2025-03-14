import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../input";
import styles from "./styles.module.css";
import { Label } from "../label";

interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  errors?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id: providedId, errors, className, ...props }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const hasErrors = errors !== undefined;

    const inputClasses = cn(className, {
      [styles["input-field--error"]]: hasErrors,
    });

    return (
      <div className={styles["input-field"]}>
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} className={inputClasses} {...props} ref={ref} />
        {hasErrors && (
          <div className={styles["input-field__error"]}>
            <p>{errors}</p>
          </div>
        )}
      </div>
    );
  }
);
