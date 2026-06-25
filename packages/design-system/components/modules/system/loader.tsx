"use client";

import { cn } from "@xbase/design-system/lib/utils";

export interface LoaderProps {
  className?: string;
  fullHeight?: boolean;
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<LoaderProps["size"]>, string> = {
  lg: "size-12",
  md: "size-8",
  sm: "size-6",
};

export function Loader({
  className,
  fullHeight = true,
  fullPage,
  size = "lg",
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-background",
        fullPage && "min-h-svh w-screen md:min-h-lvh",
        fullHeight && "h-full min-h-[80vh]",
        className
      )}
      data-slot="loader"
    >
      <div
        aria-label="Loading"
        className={cn("relative", sizeClasses[size])}
        role="status"
      >
        <div className="absolute inset-0 animate-[xbaseSmoothMorph_3s_ease-in-out_infinite] bg-primary" />

        <style>{`
          @keyframes xbaseSmoothMorph {
            0% {
              transform: scale(1) rotate(0deg);
              border-radius: 50%;
            }
            20% {
              transform: scale(0.9) rotate(72deg);
              border-radius: 35%;
            }
            40% {
              transform: scale(1.1) rotate(144deg);
              border-radius: 15%;
            }
            60% {
              transform: scale(0.85) rotate(216deg);
              border-radius: 8%;
            }
            80% {
              transform: scale(1.05) rotate(288deg);
              border-radius: 25%;
            }
            100% {
              transform: scale(1) rotate(360deg);
              border-radius: 50%;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Loader;
