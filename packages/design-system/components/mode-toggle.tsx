"use client";

import { Moon, Sun } from "@xbase/icons/lucide";
import { useTheme } from "next-themes";
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

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export interface ModeToggleProps {
  buttonVariant?: ButtonProps["variant"];
  className?: string;
  contentClassName?: string;
  showLabel?: boolean;
}

export const ModeToggle = ({
  buttonVariant = "ghost",
  className,
  contentClassName,
  showLabel = false,
}: ModeToggleProps) => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Toggle theme"
          className={cn(
            "relative shrink-0 text-foreground",
            showLabel ? "gap-2" : "",
            className
          )}
          size={showLabel ? "default" : "icon"}
          type="button"
          variant={buttonVariant}
        >
          <span className="relative flex size-4 shrink-0 items-center justify-center">
            <Sun className="absolute size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </span>
          {showLabel ? <span>Theme</span> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={contentClassName}>
        {themes.map(({ label, value }) => (
          <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
