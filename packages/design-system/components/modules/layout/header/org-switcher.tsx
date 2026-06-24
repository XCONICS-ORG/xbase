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
import { IconCheck, IconChevronDown, IconPlus } from "@xbase/icons/tabler";
import type { AvatarOptions, AvatarStyleName } from "@xbase/utility/generators/avatar";
import { HeaderAvatar } from "./avatar";

export interface HeaderOrganization {
  avatarOptions?: AvatarOptions;
  avatarStyle?: AvatarStyleName;
  id: string;
  image?: null | string;
  name: string;
}

export interface OrgSwitcherProps {
  activeOrganizationId: string;
  addOrganizationLabel?: string;
  avatarOptions?: AvatarOptions;
  avatarStyle?: AvatarStyleName;
  buttonVariant?: ButtonProps["variant"];
  className?: string;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  onAddOrganization?: () => void;
  onOrganizationChange?: (organization: HeaderOrganization) => void;
  organizations: HeaderOrganization[];
}

const nameSplitPattern = /\s+/;

function getShortName(name: string) {
  return name.trim().split(nameSplitPattern).filter(Boolean).slice(0, 2).join(" ");
}

export function OrgSwitcher({
  activeOrganizationId,
  addOrganizationLabel = "Add organization",
  avatarOptions,
  avatarStyle = "shapegrid",
  buttonVariant = "ghost",
  className,
  disabled,
  label = "Organization",
  loading,
  onAddOrganization,
  onOrganizationChange,
  organizations,
}: OrgSwitcherProps) {
  const activeOrganization =
    organizations.find((organization) => organization.id === activeOrganizationId) ??
    organizations[0];

  if (!activeOrganization) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("h-9 gap-2 px-2.5", className)}
          disabled={disabled || loading}
          type="button"
          variant={buttonVariant}
        >
          <HeaderAvatar
            avatarOptions={activeOrganization.avatarOptions ?? avatarOptions}
            avatarStyle={activeOrganization.avatarStyle ?? avatarStyle}
            className="size-7"
            image={activeOrganization.image}
            name={activeOrganization.name}
            rounded="md"
            size={28}
          />
          <span className="max-w-40 truncate text-xs">
            {getShortName(activeOrganization.name)}
          </span>
          <IconChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((organization) => {
          const isActive = organization.id === activeOrganization.id;

          return (
            <DropdownMenuItem
              className={cn(
                "cursor-pointer gap-2 py-2",
                isActive ? "bg-muted/60 font-medium" : ""
              )}
              key={organization.id}
              onSelect={() => onOrganizationChange?.(organization)}
            >
              <HeaderAvatar
                avatarOptions={organization.avatarOptions ?? avatarOptions}
                avatarStyle={organization.avatarStyle ?? avatarStyle}
                className="size-6"
                image={organization.image}
                name={organization.name}
                rounded="md"
                size={24}
              />
              <span className="flex-1 truncate text-sm">{organization.name}</span>
              {isActive ? (
                <IconCheck className="ml-auto size-3.5 shrink-0 text-primary" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
        {onAddOrganization ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 py-2 text-muted-foreground"
              onSelect={onAddOrganization}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-dashed">
                <IconPlus className="size-3.5" />
              </span>
              <span className="text-sm">{addOrganizationLabel}</span>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
