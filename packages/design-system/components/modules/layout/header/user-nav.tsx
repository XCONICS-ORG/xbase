"use client";

import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@xbase/design-system/components/ui/dropdown-menu";
import { cn } from "@xbase/design-system/lib/utils";
import { IconLogout } from "@xbase/icons/tabler";
import type {
  AvatarOptions,
  AvatarStyleName,
} from "@xbase/utility/generators/avatar";
import type { ReactNode } from "react";
import { HeaderAvatar } from "./avatar";

export interface HeaderUser {
  avatarOptions?: AvatarOptions;
  avatarStyle?: AvatarStyleName;
  email?: null | string;
  image?: null | string;
  name: string;
}

export interface HeaderUserMenuItem {
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface UserNavDropdownProps {
  avatarOptions?: AvatarOptions;
  avatarStyle?: AvatarStyleName;
  buttonVariant?: ButtonProps["variant"];
  className?: string;
  contentClassName?: string;
  logoutLabel?: string;
  menuItems?: HeaderUserMenuItem[];
  onLogout?: () => void;
  user?: HeaderUser | null;
}

export function UserNavDropdown({
  avatarOptions,
  avatarStyle = "identicon",
  buttonVariant = "outline",
  className,
  contentClassName,
  logoutLabel = "Logout",
  menuItems = [],
  onLogout,
  user,
}: UserNavDropdownProps) {
  if (!user) {
    return (
      <div
        className={cn("size-9 animate-pulse rounded-full bg-muted", className)}
        data-slot="user-nav-skeleton"
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open user menu"
          className={cn("size-9 overflow-hidden rounded-full p-0", className)}
          type="button"
          variant={buttonVariant}
        >
          <HeaderAvatar
            avatarOptions={user.avatarOptions ?? avatarOptions}
            avatarStyle={user.avatarStyle ?? avatarStyle}
            image={user.image}
            name={user.name}
            size={36}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={cn("w-56 pb-2", contentClassName)}
        sideOffset={8}
      >
        <DropdownMenuLabel>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-semibold text-secondary-foreground text-sm">
              {user.name}
            </span>
            {user.email ? (
              <span className="truncate font-normal text-muted-foreground text-xs">
                {user.email}
              </span>
            ) : null}
          </span>
        </DropdownMenuLabel>
        {menuItems.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            {menuItems.map((item) => (
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={item.disabled}
                key={item.id}
                onSelect={item.onSelect}
              >
                {item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </>
        ) : null}
        {onLogout ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="mx-1 mt-1 cursor-pointer justify-center border border-primary text-primary"
              onSelect={onLogout}
            >
              <span>{logoutLabel}</span>
              <IconLogout className="size-4 shrink-0" />
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
