import { useState } from "react";
import { Form, useSearchParams } from "react-router";

import { Button, InputField, Label } from "@/components/ui";

interface CategoryVariant {
  id: number;
  label: string;
  value: string;
}

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  categoryVariants: CategoryVariant[];
  selectedVariants: string[];
  className?: string;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  categoryVariants,
  selectedVariants,
  className,
}: PriceFilterProps) {
  const [searchParams] = useSearchParams();
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localSelectedVariants, setLocalSelectedVariants] =
    useState<string[]>(selectedVariants);

  const handleVariantChange = (variantId: string, checked: boolean) => {
    if (checked) {
      setLocalSelectedVariants((prev) => [...prev, variantId]);
    } else {
      setLocalSelectedVariants((prev) => prev.filter((id) => id !== variantId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Agregar variantes seleccionadas al FormData
    localSelectedVariants.forEach((variantId) => {
      formData.append("variants", variantId);
    });

    // Crear nueva URL con parámetros
    const newSearchParams = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      newSearchParams.append(key, value.toString());
    }

    // Mantener otros parámetros existentes
    for (const [key, value] of searchParams.entries()) {
      if (!["minPrice", "maxPrice", "variants"].includes(key)) {
        newSearchParams.append(key, value);
      }
    }

    window.location.search = newSearchParams.toString();
  };

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ EXISTENTE: Filtro por precio */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Filtrar por precio
          </Label>
          <div className="space-y-3">
            <InputField
              name="minPrice"
              label="Precio mínimo"
              placeholder="Precio mínimo"
              type="number"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
            />
            <InputField
              name="maxPrice"
              label="Precio máximo"
              placeholder="Precio máximo"
              type="number"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {/* ✅ NUEVO: Filtro por variantes */}
        {categoryVariants.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Filtrar por opciones
            </Label>
            <div className="space-y-2">
              {categoryVariants.map((variant) => (
                <label key={variant.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSelectedVariants.includes(
                      variant.id.toString()
                    )}
                    onChange={(e) =>
                      handleVariantChange(
                        variant.id.toString(),
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{variant.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            Aplicar filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setLocalMinPrice("");
              setLocalMaxPrice("");
              setLocalSelectedVariants([]);
              window.location.search = "";
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      </Form>
    </div>
  );
}
