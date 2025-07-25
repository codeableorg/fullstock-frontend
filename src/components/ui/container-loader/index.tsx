import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

interface ContainerLoaderProps {
  className?: string;
}

export function ContainerLoader({ className }: ContainerLoaderProps) {
  return (
    <div className="flex h-full grow items-center justify-center">
      <Loader
        className={cn("h-8 w-8 animate-spin", className)}
        aria-label="Loading"
      />
    </div>
  );
}
