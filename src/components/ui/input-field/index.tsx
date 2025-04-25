import { type ComponentPropsWithoutRef, forwardRef, useId } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../input";
import { Label } from "../label";

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
      "border-red-500": hasError,
    });

    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input ref={ref} id={id} className={inputClasses} {...props} />
        {hasError && (
          <div className="text-red-500 text-sm mt-1 leading-none">
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
