"use client";

import { cn } from "@xbase/design-system/lib/utils";
import {
  Skeleton as BoneyardSkeleton,
  type SkeletonProps as BoneyardSkeletonProps,
} from "boneyard-js/react";

export type SkeletonWrapperProps = BoneyardSkeletonProps & {
  boneClassName?: string;
};

export function SkeletonWrapper({
  animate = "shimmer",
  boneClassName,
  className,
  transition = 220,
  ...props
}: SkeletonWrapperProps) {
  return (
    <BoneyardSkeleton
      animate={animate}
      boneClass={cn("rounded-none", boneClassName)}
      className={className}
      transition={transition}
      {...props}
    />
  );
}
