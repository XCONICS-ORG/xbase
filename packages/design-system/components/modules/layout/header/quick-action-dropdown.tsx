"use client";

import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@xbase/design-system/components/ui/dropdown-menu";
import { cn } from "@xbase/design-system/lib/utils";
import { IconChevronDown, IconSparkles } from "@xbase/icons/tabler";
import type { ReactNode } from "react";

export interface HeaderQuickAction {
  description?: string;
  disabled?: boolean;
  icon: ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface QuickActionDropdownProps {
  actions: HeaderQuickAction[];
  buttonVariant?: ButtonProps["variant"];
  className?: string;
  contentClassName?: string;
  label?: string;
}

export function QuickActionDropdown({
  actions,
  buttonVariant = "ghost",
  className,
  contentClassName,
  label = "Quick Actions",
}: QuickActionDropdownProps) {
  const visibleActions = actions.filter(Boolean);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("gap-2", className)}
          type="button"
          variant={buttonVariant}
        >
          <IconSparkles className="size-4 shrink-0 text-primary" />
          <span>{label}</span>
          <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className={cn("w-64", contentClassName)}
      >
        {visibleActions.map((action) => (
          <DropdownMenuItem
            className="min-h-12 cursor-pointer items-start gap-3 py-2"
            disabled={action.disabled}
            key={action.id}
            onSelect={action.onSelect}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
              {action.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-secondary-foreground text-sm">
                {action.label}
              </span>
              {action.description ? (
                <span className="block truncate text-muted-foreground text-xs">
                  {action.description}
                </span>
              ) : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
