import { ComponentPropsWithoutRef, useId } from "react";

import { Input } from "./input";

interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
}

export function InputField({
  label,
  id: providedId,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium leading-none" htmlFor={id}>
        {label}
      </label>
      <Input id={id} {...props} />
    </div>
  );
}
