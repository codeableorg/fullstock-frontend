import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  className?: string;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  onPriceChange,
  className,
}: PriceFilterProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onPriceChange(
      formData.get("minPrice") as string,
      formData.get("maxPrice") as string
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      <fieldset>
        <legend className="text-lg font-medium mb-4">Precio</legend>
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">Min</label>
            <Input
              type="number"
              name="minPrice"
              defaultValue={minPrice}
              min="0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-base font-medium">Max</label>
            <Input
              type="number"
              name="maxPrice"
              defaultValue={maxPrice}
              min="0"
            />
          </div>
        </div>
      </fieldset>

      <Button type="submit" size="xl" variant="secondary" className="w-full">
        Filtar Productos
      </Button>
    </form>
  );
}
