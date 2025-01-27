import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerVariant = "default" | "content" | "main" | "fullpage";

interface SpinnerProps {
  className?: string;
  variant?: SpinnerVariant;
}

export function Spinner({ className, variant = "default" }: SpinnerProps) {
  const containers = {
    default: "",
    content: "flex-1 h-full flex items-center justify-center",
    main: "flex-1 flex items-center justify-center min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-90px)]",
    fullpage: "min-h-screen flex items-center justify-center",
  };

  return (
    <div className={containers[variant]}>
      <Loader
        className={cn("h-8 w-8 animate-spin", className)}
        aria-label="Loading"
      />
    </div>
  );
}
