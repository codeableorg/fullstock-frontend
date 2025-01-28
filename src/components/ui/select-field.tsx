import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?(value: string): void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  form?: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function SelectField({
  label,
  id: providedId,
  options,
  placeholder = "Select",
  ...props
}: SelectFieldProps) {
  const generatedId = useId();
  const id = providedId || generatedId;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium leading-none" htmlFor={id}>
        {label}
      </label>
      <Select {...props}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
