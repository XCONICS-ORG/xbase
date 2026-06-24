"use client";

import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
} from "@xbase/design-system/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@xbase/design-system/components/ui/dropdown-menu";
import { cn } from "@xbase/design-system/lib/utils";
import { IconDotsVertical } from "@xbase/icons/tabler";
import type { AccessPredicate, AccessRequirement } from "@xbase/types/access";
import type { ReactNode } from "react";

export type DataTableCellActionVariant =
  | ButtonProps["variant"]
  | "delete"
  | "success";

export interface DataTableCellActionItem<TAccess = AccessRequirement> {
  access?: TAccess;
  disabled?: boolean;
  hidden?: boolean;
  icon: ReactNode;
  id: string;
  label: string;
  onClick?: () => void;
  showLabel?: boolean;
  variant?: DataTableCellActionVariant;
}

export type DataTableCellActionShowType =
  | "context-menu"
  | "dropdown"
  | "inline";

export interface DataTableCellActionProps<TAccess = AccessRequirement> {
  actions: DataTableCellActionItem<TAccess>[];
  align?: "left" | "center" | "right";
  canAccess?: AccessPredicate<TAccess>;
  className?: string;
  dropdownContentClassName?: string;
  showType?: DataTableCellActionShowType;
  triggerLabel?: string;
}

const actionCellInnerClassName = "inline-flex items-center justify-center";

function getActionCellAlignmentClassName(
  align: NonNullable<DataTableCellActionProps["align"]>
) {
  if (align === "left") {
    return "justify-start";
  }

  if (align === "right") {
    return "justify-end";
  }

  return "justify-center";
}

function getInlineButtonVariant(
  variant: DataTableCellActionItem["variant"]
): ButtonProps["variant"] {
  if (variant === "delete") {
    return "destructive";
  }

  if (variant === "success") {
    return "default";
  }

  return variant ?? "secondary";
}

function getDropdownItemVariant(
  variant: DataTableCellActionItem["variant"]
): "default" | "destructive" {
  if (variant === "destructive" || variant === "delete") {
    return "destructive";
  }

  return "default";
}

export function DataTableCellAction({
  align = "center",
  actions,
  canAccess,
  className,
  dropdownContentClassName,
  showType = "dropdown",
  triggerLabel = "Open actions menu",
}: DataTableCellActionProps) {
  const visibleActions = actions.filter(
    (action) => action.hidden !== true && (canAccess?.(action.access) ?? true)
  );

  if (visibleActions.length === 0) {
    return null;
  }

  if (showType === "inline") {
    return (
      <div
        className={cn(
          "flex w-full items-center",
          getActionCellAlignmentClassName(align),
          className
        )}
      >
        <div className={cn(actionCellInnerClassName, "gap-2")}>
          {visibleActions.map((action) => (
            <Button
              aria-label={action.label}
              className="shrink-0"
              disabled={action.disabled}
              key={action.id}
              onClick={action.onClick}
              rightIcon={action.showLabel ? action.icon : undefined}
              size={action.showLabel ? "sm" : "icon-sm"}
              type="button"
              variant={getInlineButtonVariant(action.variant)}
            >
              {action.showLabel ? null : (
                <span className="sr-only">{action.label}</span>
              )}
              {action.showLabel ? action.label : action.icon}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  const renderedItems = visibleActions.map((action) => (
    <DropdownMenuItem
      disabled={action.disabled}
      key={action.id}
      onSelect={action.onClick}
      variant={getDropdownItemVariant(action.variant)}
    >
      {action.icon}
      <span className="whitespace-nowrap">{action.label}</span>
    </DropdownMenuItem>
  ));

  if (showType === "context-menu") {
    return (
      <ContextMenuContent className={cn("min-w-36", dropdownContentClassName)}>
        <ContextMenuGroup>
          {visibleActions.map((action) => (
            <ContextMenuItem
              disabled={action.disabled}
              key={action.id}
              onSelect={action.onClick}
              variant={getDropdownItemVariant(action.variant)}
            >
              {action.icon}
              <span className="whitespace-nowrap">{action.label}</span>
            </ContextMenuItem>
          ))}
        </ContextMenuGroup>
      </ContextMenuContent>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-center",
        getActionCellAlignmentClassName(align),
        className
      )}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={triggerLabel}
            className="data-[state=open]:bg-muted"
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <IconDotsVertical className="size-4 stroke-[1.5px]" />
            <span className="sr-only">{triggerLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className={cn("min-w-28", dropdownContentClassName)}
          sideOffset={4}
        >
          {renderedItems}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
