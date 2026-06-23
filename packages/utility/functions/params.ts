"use client";

import { usePathname } from "next/navigation";

export const useCurrentPath = (remove?: string | string[]) => {
  const pathname = usePathname() ?? "/";

  if (!remove) {
    return pathname;
  }

  const toRemove = new Set(Array.isArray(remove) ? remove : [remove]);

  const segments = pathname.split("/").filter(Boolean);

  // If any removal segment is found, remove it and everything after it.
  const firstMatchIndex = segments.findIndex((seg) => toRemove.has(seg));
  const keptSegments =
    firstMatchIndex === -1 ? segments : segments.slice(0, firstMatchIndex);

  const newPath = `/${keptSegments.join("/")}`;
  return newPath === "" ? "/" : newPath;
};
