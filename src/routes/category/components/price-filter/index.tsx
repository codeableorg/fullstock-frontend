import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

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
      className={cn(styles["price-filter"], className)}
    >
      <fieldset>
        <legend className={styles["price-filter__legend"]}>Precio</legend>
        <div className={styles["price-filter__inputs"]}>
          <div className={styles["price-filter__field"]}>
            <label className={styles["price-filter__label"]}>Min</label>
            <Input
              type="number"
              name="minPrice"
              defaultValue={minPrice}
              min="0"
            />
          </div>
          <div className={styles["price-filter__field"]}>
            <label className={styles["price-filter__label"]}>Max</label>
            <Input
              type="number"
              name="maxPrice"
              defaultValue={maxPrice}
              min="0"
            />
          </div>
        </div>
      </fieldset>

      <Button
        type="submit"
        size="xl"
        variant="secondary"
        className={styles["price-filter__button"]}
      >
        Filtar Productos
      </Button>
    </form>
  );
}
