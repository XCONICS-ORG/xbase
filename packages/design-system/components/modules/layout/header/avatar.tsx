"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@xbase/design-system/components/ui/avatar";
import { cn } from "@xbase/design-system/lib/utils";
import {
  generateAvatarDataUri,
  type AvatarOptions,
  type AvatarStyleName,
} from "@xbase/utility/generators/avatar";

export interface HeaderAvatarProps {
  avatarOptions?: AvatarOptions;
  avatarStyle?: AvatarStyleName;
  className?: string;
  image?: null | string;
  name: string;
  rounded?: "full" | "md";
  size?: number;
}

const nameSplitPattern = /\s+/;

function getInitials(name: string) {
  return name
    .trim()
    .split(nameSplitPattern)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function HeaderAvatar({
  avatarOptions,
  avatarStyle = "shapegrid",
  className,
  image,
  name,
  rounded = "full",
  size = 32,
}: HeaderAvatarProps) {
  const fallback = getInitials(name) || "?";
  const avatarSrc =
    image ??
    generateAvatarDataUri({
      name,
      options: avatarOptions,
      size,
      style: avatarStyle,
    });
  const roundedClassName = rounded === "md" ? "rounded-md" : "rounded-full";

  return (
    <Avatar
      className={cn(roundedClassName, className)}
      style={{ height: size, width: size }}
    >
      <AvatarImage alt={name} className={roundedClassName} src={avatarSrc} />
      <AvatarFallback className={roundedClassName}>{fallback}</AvatarFallback>
    </Avatar>
  );
}
