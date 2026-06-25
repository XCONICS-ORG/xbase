"use client";

import type { ModeToggleProps } from "@xbase/design-system/components/mode-toggle";
import { ModeToggle } from "@xbase/design-system/components/mode-toggle";
import { Logo } from "@xbase/design-system/components/shared/logo";
import { cn } from "@xbase/design-system/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FullscreenToggle, type FullscreenToggleProps } from "./fullscreen";
import { InstallWebApp, type InstallWebAppProps } from "./install-web-app";
import { OrgSwitcher, type OrgSwitcherProps } from "./org-switcher";
import { PingIndicator, type PingIndicatorProps } from "./ping";
import {
  QuickActionDropdown,
  type QuickActionDropdownProps,
} from "./quick-action-dropdown";
import { UserNavDropdown, type UserNavDropdownProps } from "./user-nav";

export interface AppHeaderProps
  extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
  actionsEnd?: ReactNode;
  actionsStart?: ReactNode;
  brand?: ReactNode;
  fixed?: boolean;
  fullscreenToggleProps?: FullscreenToggleProps;
  installWebAppProps?: InstallWebAppProps;
  modeToggleProps?: ModeToggleProps;
  orgSwitcherProps?: OrgSwitcherProps;
  pingIndicatorProps?: PingIndicatorProps;
  quickActionDropdownProps?: QuickActionDropdownProps;
  showFullscreenToggle?: boolean;
  showModeToggle?: boolean;
  userNavDropdownProps?: UserNavDropdownProps;
}

export function HeaderActionSlot({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-full w-auto items-center justify-center border-r px-3 transition-colors first:border-l"
      data-app-header="item"
    >
      {children}
    </div>
  );
}

export function AppHeader({
  actionsEnd,
  actionsStart,
  brand,
  className,
  fixed = true,
  fullscreenToggleProps,
  installWebAppProps,
  modeToggleProps,
  orgSwitcherProps,
  pingIndicatorProps,
  quickActionDropdownProps,
  showFullscreenToggle = true,
  showModeToggle = true,
  userNavDropdownProps,
  ...props
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-50 flex h-14 border-b bg-background/95 backdrop-blur",
        fixed ? "fixed" : "relative",
        className
      )}
      data-app-header="root"
      {...props}
    >
      <div className="flex h-full w-full min-w-0 items-center justify-between pl-4">
        <div className="flex min-w-0 items-center gap-2">
          {brand ?? <Logo className="w-28" href="/" priority variant="text" />}
        </div>
        <nav
          aria-label="Header actions"
          className="flex h-full min-w-0 items-center justify-end"
        >
          {actionsStart}
          {installWebAppProps ? (
            <HeaderActionSlot>
              <InstallWebApp {...installWebAppProps} />
            </HeaderActionSlot>
          ) : null}
          {showFullscreenToggle ? (
            <HeaderActionSlot>
              <FullscreenToggle {...fullscreenToggleProps} />
            </HeaderActionSlot>
          ) : null}
          {quickActionDropdownProps ? (
            <HeaderActionSlot>
              <QuickActionDropdown {...quickActionDropdownProps} />
            </HeaderActionSlot>
          ) : null}
          {pingIndicatorProps ? (
            <HeaderActionSlot>
              <PingIndicator {...pingIndicatorProps} />
            </HeaderActionSlot>
          ) : null}
          {orgSwitcherProps ? (
            <HeaderActionSlot>
              <OrgSwitcher {...orgSwitcherProps} />
            </HeaderActionSlot>
          ) : null}
          {showModeToggle ? (
            <HeaderActionSlot>
              <ModeToggle {...modeToggleProps} />
            </HeaderActionSlot>
          ) : null}
          {userNavDropdownProps ? (
            <HeaderActionSlot>
              <UserNavDropdown {...userNavDropdownProps} />
            </HeaderActionSlot>
          ) : null}
          {actionsEnd}
        </nav>
      </div>
    </header>
  );
}

export type { HeaderAvatarProps } from "./avatar";
// biome-ignore lint/performance/noBarrelFile: Public header module facade.
export { HeaderAvatar } from "./avatar";
export type { FullscreenToggleProps } from "./fullscreen";
export { FullscreenToggle } from "./fullscreen";
export type { InstallWebAppProps } from "./install-web-app";
export { InstallWebApp } from "./install-web-app";
export type { HeaderOrganization, OrgSwitcherProps } from "./org-switcher";
export { OrgSwitcher } from "./org-switcher";
export type { PingIndicatorProps } from "./ping";
export { PingIndicator } from "./ping";
export type {
  HeaderQuickAction,
  QuickActionDropdownProps,
} from "./quick-action-dropdown";
export { QuickActionDropdown } from "./quick-action-dropdown";
export type {
  HeaderUser,
  HeaderUserMenuItem,
  UserNavDropdownProps,
} from "./user-nav";
export { UserNavDropdown } from "./user-nav";
