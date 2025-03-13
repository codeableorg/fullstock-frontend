import { ComponentPropsWithoutRef, useId } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../input";
import styles from "./styles.module.css";
import { Label } from "../label";

interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  errors?: string[];
}

export function InputField({
  label,
  id: providedId,
  errors,
  className,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  const hasErrors = errors && errors.length > 0;

  const inputClasses = cn(className, {
    [styles["input-field--error"]]: hasErrors,
  });

  return (
    <div className={styles["input-field"]}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} className={inputClasses} {...props} />
      {hasErrors && (
        <div className={styles["input-field__error"]}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
