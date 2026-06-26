import { cn } from "@xbase/design-system/lib/utils";
import type React from "react";

interface StatusIndicatorProps {
  className?: string;
  color?: string;
  label?: string;
  labelClassName?: string;
  size?: "sm" | "md" | "lg";
  state: "active" | "down" | "fixing" | "idle";
}

const getStateColors = (state: StatusIndicatorProps["state"]) => {
  switch (state) {
    case "active":
      return { dot: "bg-green-500", ping: "bg-green-300" };
    case "down":
      return { dot: "bg-red-500", ping: "bg-red-300" };
    case "fixing":
      return { dot: "bg-yellow-500", ping: "bg-yellow-300" };
    default:
      return { dot: "bg-slate-700", ping: "bg-slate-400" };
  }
};

const getSizeClasses = (size: StatusIndicatorProps["size"]) => {
  switch (size) {
    case "sm":
      return { dot: "h-2 w-2", ping: "h-2 w-2" };
    case "lg":
      return { dot: "h-4 w-4", ping: "h-4 w-4" };
    default:
      return { dot: "h-3 w-3", ping: "h-3 w-3" };
  }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  state = "idle",
  color,
  label,
  className,
  size = "md",
  labelClassName,
}) => {
  const shouldAnimate =
    state === "active" || state === "fixing" || state === "down";
  const colors = getStateColors(state);
  const sizeClasses = getSizeClasses(size);
  const customColorStyle = color ? { backgroundColor: color } : undefined;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center">
        {shouldAnimate && (
          <span
            className={cn(
              "absolute inline-flex animate-ping rounded-full opacity-75",
              sizeClasses.ping,
              !color && colors.ping
            )}
            style={customColorStyle}
          />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full",
            sizeClasses.dot,
            !color && colors.dot
          )}
          style={customColorStyle}
        />
      </div>
      {label && (
        <p
          className={cn(
            "text-slate-700 text-sm dark:text-slate-300",
            labelClassName
          )}
        >
          {label}
        </p>
      )}
    </div>
  );
};

export { StatusIndicator };
export default StatusIndicator;
