import { Form } from "react-router";

import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  className?: string;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  className,
}: PriceFilterProps) {
  return (
    <Form className={cn("flex flex-col gap-6", className)}>
      <fieldset>
        <legend className="text-base font-medium mb-4">Precio</legend>
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Min</label>
            <Input
              type="number"
              name="minPrice"
              defaultValue={minPrice}
              min="0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Max</label>
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
        Filtrar Productos
      </Button>
    </Form>
  );
}
