"use client";

import {
  ContextMenu,
  ContextMenuTrigger,
} from "@xbase/design-system/components/ui/context-menu";
import type { ReactNode } from "react";

interface DataTableRowContextMenuProps {
  children: ReactNode;
  content: ReactNode;
}

export function DataTableRowContextMenu({
  children,
  content,
}: DataTableRowContextMenuProps) {
  return (
    <ContextMenu modal={false}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      {content}
    </ContextMenu>
  );
}
