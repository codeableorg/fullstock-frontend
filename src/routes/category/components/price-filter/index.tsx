import { useSubmit } from "react-router";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  className?: string;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  className,
}: PriceFilterProps) {
  const submit = useSubmit()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const minPrice = formData.get("minPrice")
    const maxPrice = formData.get("maxPrice")
    if (!minPrice && !maxPrice) return
    if (maxPrice && minPrice && maxPrice < minPrice) return
    submit(formData, { method: 'get', action: window.location.pathname })
  }
  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)}>
      <fieldset>
        <legend className="text-base font-medium mb-4">Precio</legend>
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Min</label>
            <Input
              name="minPrice"
              defaultValue={minPrice}
              min="0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Max</label>
            <Input
              name="maxPrice"
              defaultValue={maxPrice}
              min="0"
            />
          </div>
        </div>
      </fieldset>
      <Button type="submit" size="xl" variant="secondary" className="w-full">
        Filtrar Productos
      </Button>
    </form>
  );
}
