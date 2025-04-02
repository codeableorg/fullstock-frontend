import { ComponentPropsWithoutRef, forwardRef, useId } from "react";

import { cn } from "@/lib/utils";

import { Label } from "../label";
import { Select } from "../select";

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

    const selectClasses = cn(
      "block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
      hasError
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 dark:border-gray-600",
      className
    );

    return (
      <div className="space-y-1">
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
          <div className="mt-1 text-sm text-red-600 dark:text-red-400">
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
