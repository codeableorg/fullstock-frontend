import { Button } from "@/components/ui/button";

export function ProductCardFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Algo salio mal:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <Button size="sm" onClick={resetErrorBoundary}>
        Volver a intentar
      </Button>
    </div>
  );
}
