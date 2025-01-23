import { Loader } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return (
    <Loader
      className={`h-4 w-4 animate-spin ${className ?? ""}`}
      aria-label="Loading"
    />
  );
}

export function ContentSpinner() {
  return (
    <div className="flex-1 h-full flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
