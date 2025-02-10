import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface ContainerLoaderProps {
  className?: string;
}

export function ContainerLoader({ className }: ContainerLoaderProps) {
  return (
    <div className={styles["container-loader"]}>
      <Loader
        className={cn(styles["container-loader__spinner"], className)}
        aria-label="Loading"
      />
    </div>
  );
}
