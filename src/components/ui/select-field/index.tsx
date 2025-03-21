import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

import { cn } from "@/lib/utils";

import { Label } from "../label";
import { Select } from "../select";
import styles from "./styles.module.css";

interface SelectFieldProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, id: providedId, error, className, options, placeholder, ...props },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const hasError = Boolean(error);

    const selectClasses = cn(className, {
      [styles["select-field--error"]]: hasError,
    });

    return (
      <div className={styles["select-field"]}>
        <Label htmlFor={id}>{label}</Label>
        <Select ref={ref} id={id} className={selectClasses} {...props}>
          <option value="">{placeholder || "Seleccione una opción"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {hasError && (
          <div className={styles["select-field__error"]}>
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
