"use client";

import comingSoonIllustration from "@xbase/assets/images/modules/system/coming-soon.svg";
import emptyTableIllustration from "@xbase/assets/images/modules/system/empty-table.svg";
import notFoundIllustration from "@xbase/assets/images/modules/system/not-found.svg";
import { Button } from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type ModuleBlockVariant = "coming-soon" | "data-not-found";

interface ComingSoonBlockProps {
  className?: string;
  description?: ReactNode;
  fullHeight?: boolean;
  fullPage?: boolean;
  image?: StaticImageData;
  title?: ReactNode;
  variant?: ModuleBlockVariant;
}

interface DataNotFoundBlockProps {
  actionLabel?: string;
  className?: string;
  description?: ReactNode;
  fullHeight?: boolean;
  fullPage?: boolean;
  onAction?: () => void;
  title?: ReactNode;
}

const moduleBlockConfigs = {
  "coming-soon": {
    image: comingSoonIllustration,
    title: "Coming Soon",
    description: "Stay tuned for the upcoming updates",
  },
  "data-not-found": {
    image: emptyTableIllustration,
    title: "No Data Found",
    description: "There's nothing here yet. Data will appear once available.",
  },
} satisfies Record<
  ModuleBlockVariant,
  { description: string; image: StaticImageData; title: string }
>;

export function ComingSoonBlock({
  className,
  description,
  fullHeight,
  fullPage,
  image,
  title,
  variant = "coming-soon",
}: ComingSoonBlockProps) {
  const config = moduleBlockConfigs[variant];

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center border bg-background",
        fullPage && "min-h-svh w-screen md:min-h-lvh",
        fullHeight && "h-full min-h-[90vh]",
        className
      )}
    >
      <Image
        alt={String(title ?? config.title)}
        className="pointer-events-none mx-auto w-60 select-none"
        height={300}
        loading="eager"
        src={image ?? config.image}
        width={300}
      />
      <h1 className="mt-4 font-medium text-secondary-foreground text-xl tracking-wide">
        {title ?? config.title}
      </h1>
      <p className="mt-1 font-medium text-md text-muted-foreground">
        {description ?? config.description}
      </p>
    </div>
  );
}

export function DataNotFoundBlock({
  actionLabel = "Go Back",
  className,
  description = "Something went wrong, please try again",
  fullHeight = true,
  fullPage,
  onAction,
  title = "Oops!",
}: DataNotFoundBlockProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center border bg-background",
        fullPage && "min-h-svh w-screen md:min-h-lvh",
        fullHeight && "h-full min-h-[80vh]",
        className
      )}
    >
      <Image
        alt="Data not found"
        className="pointer-events-none mx-auto w-60 select-none"
        height={300}
        loading="eager"
        src={notFoundIllustration}
        width={300}
      />
      <h1 className="-mt-8 font-medium text-secondary-foreground text-xl tracking-wide">
        {title}
      </h1>
      <p className="mt-1 text-center font-medium text-md text-muted-foreground">
        {description}
      </p>
      {onAction ? (
        <Button
          className="mt-4"
          onClick={onAction}
          type="button"
          variant="outline"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
