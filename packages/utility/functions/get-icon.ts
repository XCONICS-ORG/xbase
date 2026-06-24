// biome-ignore lint/performance/noNamespaceImport: Dynamic lookup by icon name needs the package registry.
import * as HugeIcons from "@xbase/icons/hugeicons";
// biome-ignore lint/performance/noNamespaceImport: Dynamic lookup by icon name needs the package registry.
import * as LucideIcons from "@xbase/icons/lucide";
// biome-ignore lint/performance/noNamespaceImport: Dynamic lookup by icon name needs the package registry.
import * as PhosphorIcons from "@xbase/icons/phosphor";
// biome-ignore lint/performance/noNamespaceImport: Dynamic lookup by icon name needs the package registry.
import * as TablerIcons from "@xbase/icons/tabler";
import type { ElementType } from "react";

export type IconLibraryName = "hugeicons" | "lucide" | "phosphor" | "tabler";

type Icon = ElementType;
type IconRegistry = Record<string, unknown>;

export interface GetIconOptions {
  fallbackIconName?: string;
  iconLibrary?: IconLibraryName;
  iconName: string | null | undefined;
}

const iconLibraries: Record<IconLibraryName, IconRegistry> = {
  hugeicons: HugeIcons as IconRegistry,
  lucide: LucideIcons as IconRegistry,
  phosphor: PhosphorIcons as IconRegistry,
  tabler: TablerIcons as IconRegistry,
};

const wordSeparatorPattern = /[-_\s]+/;

function toPascalCase(value: string) {
  return value
    .trim()
    .split(wordSeparatorPattern)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function getIconNameCandidates(iconName: string, iconLibrary: IconLibraryName) {
  const trimmedName = iconName.trim();
  const pascalName = toPascalCase(trimmedName);
  const prefixedName = `Icon${pascalName}`;

  return iconLibrary === "lucide"
    ? [trimmedName, pascalName]
    : [trimmedName, pascalName, prefixedName];
}

function findIcon(
  iconName: string,
  iconLibrary: IconLibraryName,
  fallbackIconName = "IconCommand"
) {
  const icons = iconLibraries[iconLibrary];
  const fallbackIcons = iconLibraries.tabler;
  const iconCandidates = getIconNameCandidates(iconName, iconLibrary);
  const fallbackCandidates = getIconNameCandidates(fallbackIconName, "tabler");

  for (const candidate of iconCandidates) {
    const icon = icons[candidate];

    if (icon) {
      return icon as Icon;
    }
  }

  for (const candidate of fallbackCandidates) {
    const fallbackIcon = fallbackIcons[candidate];

    if (fallbackIcon) {
      return fallbackIcon as Icon;
    }
  }

  return TablerIcons.IconCommand as Icon;
}

export function getIcon(
  iconNameOrOptions: GetIconOptions | string,
  iconLibrary: IconLibraryName = "tabler"
) {
  if (typeof iconNameOrOptions === "string") {
    return findIcon(iconNameOrOptions, iconLibrary);
  }

  return findIcon(
    iconNameOrOptions.iconName ?? "",
    iconNameOrOptions.iconLibrary ?? "tabler",
    iconNameOrOptions.fallbackIconName
  );
}
