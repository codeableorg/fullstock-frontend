import { useId } from "react";

import { cn } from "@/lib/utils";

import { Option, Select } from "../select";
import styles from "./styles.module.css";
import { Label } from "../label";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function SelectField({
  label,
  id: providedId,
  options,
  placeholder,
  className,
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className={cn(styles["basic-select-field"], className)}>
      <Label htmlFor={id}>{label}</Label>
      <Select
        id={id}
        className={styles["basic-select-field__select"]}
        {...props}
      >
        {placeholder && <Option value="">{placeholder}</Option>}
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
