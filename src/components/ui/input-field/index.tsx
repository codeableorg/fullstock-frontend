import { ComponentPropsWithoutRef, useId } from "react";

import { Input } from "../input";
import styles from "./styles.module.css";
import { Label } from "../label";

interface InputFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  name: string;
  register: any;
  error?: string;
}

export function InputField({
  label,
  id: providedId,
  name,
  register,
  error,
  className,
  ...props
}: InputFieldProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={styles["input-field"]}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} register={register} error={error} className={className} {...props} />
    </div>
  );
}
