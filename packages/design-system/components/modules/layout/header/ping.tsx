"use client";

import { cn } from "@xbase/design-system/lib/utils";
import { IconWifi, IconWifiOff } from "@xbase/icons/tabler";

export type PingStatus = "disconnected" | "excellent" | "good" | "poor";

export interface PingIndicatorProps {
  className?: string;
  latencyMs?: null | number;
  showLabel?: boolean;
  status?: PingStatus;
}

function getPingStatus(latencyMs: null | number | undefined): PingStatus {
  if (latencyMs == null) {
    return "disconnected";
  }

  if (latencyMs < 600) {
    return "excellent";
  }

  if (latencyMs < 900) {
    return "good";
  }

  return "poor";
}

const statusConfig: Record<PingStatus, { className: string; label: string }> = {
  disconnected: {
    className: "text-muted-foreground",
    label: "Disconnected",
  },
  excellent: {
    className: "text-success",
    label: "Excellent",
  },
  good: {
    className: "text-tertiary",
    label: "Good",
  },
  poor: {
    className: "text-destructive",
    label: "Poor",
  },
};

export function PingIndicator({
  className,
  latencyMs,
  showLabel = true,
  status,
}: PingIndicatorProps) {
  const resolvedStatus = status ?? getPingStatus(latencyMs);
  const config = statusConfig[resolvedStatus];
  const Icon = resolvedStatus === "disconnected" ? IconWifiOff : IconWifi;
  const label =
    latencyMs != null && resolvedStatus !== "disconnected"
      ? `Latency: ${latencyMs.toFixed(0)}ms`
      : config.label;

  return (
    <div
      className={cn("flex items-center gap-2 text-sm", className)}
      title={label}
    >
      <Icon className={cn("size-4 shrink-0", config.className)} />
      {showLabel ? (
        <span className="whitespace-nowrap text-secondary-foreground text-xs">
          {label}
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}
