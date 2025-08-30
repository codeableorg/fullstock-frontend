type VariantOption = {
  id: number | string;
  label: string;
  value: string;
};

type VariantSelectorProps = {
  label: string;
  name: string;
  options: VariantOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

export function VariantSelector({
  label,
  name,
  options,
  selectedValue,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            type="button"
            key={option.id}
            className={`px-4 py-2 rounded border transition-colors ${
              selectedValue === option.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {/* input oculto para enviar la opción seleccionada */}
      <input type="hidden" name={name} value={selectedValue} />
    </div>
  );
}

