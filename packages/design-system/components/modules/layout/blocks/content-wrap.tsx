"use client";

import { Skeleton } from "@xbase/design-system/components/ui/skeleton";
import { cn } from "@xbase/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const contentWrapVariants = cva("w-full min-w-0", {
  variants: {
    density: {
      compact: "gap-2 p-3",
      default: "gap-3 p-4",
      relaxed: "gap-4 p-5",
    },
    layout: {
      default: "flex flex-col",
      grid: "grid",
      horizontal: "flex flex-col md:flex-row md:items-start",
    },
    variant: {
      bordered: "border bg-background",
      card: "rounded-md border bg-card shadow-xs",
      ghost: "",
      muted: "rounded-md border bg-muted/35",
      panel: "rounded-md border bg-background",
    },
  },
  defaultVariants: {
    density: "default",
    layout: "default",
    variant: "bordered",
  },
});

export interface ContentWrapProps
  extends Omit<ComponentProps<"section">, "title">,
    VariantProps<typeof contentWrapVariants> {
  actions?: ReactNode;
  bodyClassName?: string;
  children?: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  empty?: boolean;
  emptyState?: ReactNode;
  footer?: ReactNode;
  footerClassName?: string;
  headerClassName?: string;
  loading?: boolean;
  loadingRows?: number;
  title?: ReactNode;
  titleClassName?: string;
}

export function ContentWrap({
  actions,
  bodyClassName,
  children,
  className,
  density,
  description,
  descriptionClassName,
  empty = false,
  emptyState,
  footer,
  footerClassName,
  headerClassName,
  layout,
  loading = false,
  loadingRows = 3,
  title,
  titleClassName,
  variant,
  ...props
}: ContentWrapProps) {
  const hasHeader = Boolean(title || description || actions);
  const skeletonRows = Array.from({ length: loadingRows }, (_, index) => index);
  let content = children;

  if (empty) {
    content = emptyState ?? (
      <div className="flex min-h-24 items-center justify-center rounded-md border border-dashed text-muted-foreground text-xs">
        No content available
      </div>
    );
  }

  if (loading) {
    content = (
      <div className="space-y-2">
        {skeletonRows.map((row) => (
          <Skeleton className="h-8 w-full" key={row} />
        ))}
      </div>
    );
  }

  return (
    <section
      className={cn(
        contentWrapVariants({ density, layout, variant }),
        className
      )}
      {...props}
    >
      {hasHeader ? (
        <div
          className={cn(
            "flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
            headerClassName
          )}
        >
          <div className="min-w-0 space-y-1">
            {title ? (
              <h2
                className={cn(
                  "font-medium text-foreground text-sm leading-5",
                  titleClassName
                )}
              >
                {title}
              </h2>
            ) : null}
            {description ? (
              <p
                className={cn(
                  "text-muted-foreground text-xs leading-5",
                  descriptionClassName
                )}
              >
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={cn("min-w-0", bodyClassName)}>{content}</div>

      {footer ? (
        <div
          className={cn(
            "flex min-w-0 items-center justify-end gap-2 border-t pt-3",
            footerClassName
          )}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export { ContentWrap as ContentBlock };
