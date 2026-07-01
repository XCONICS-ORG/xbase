import authBackground from "@xbase/assets/images/modules/auth/background.webp";
import { Logo } from "@xbase/design-system/components/shared/logo";
import { cn } from "@xbase/design-system/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

export const authLayoutWidthPresets = [
  "media-narrow",
  "balanced",
  "media-wide",
] as const;

export type AuthLayoutWidthPreset = (typeof authLayoutWidthPresets)[number];
export type AuthLayoutMediaPosition = "left" | "right";

export interface AuthLayoutProps {
  backgroundAlt?: string;
  backgroundImage?: StaticImageData;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  logo?: ReactNode;
  mediaClassName?: string;
  mediaPosition?: AuthLayoutMediaPosition;
  widthPreset?: AuthLayoutWidthPreset;
}

const layoutGridClasses: Record<
  AuthLayoutMediaPosition,
  Record<AuthLayoutWidthPreset, string>
> = {
  left: {
    balanced: "lg:grid-cols-2",
    "media-narrow": "lg:grid-cols-[minmax(18rem,38%)_1fr]",
    "media-wide": "lg:grid-cols-[minmax(24rem,56%)_1fr]",
  },
  right: {
    balanced: "lg:grid-cols-2",
    "media-narrow": "lg:grid-cols-[1fr_minmax(18rem,38%)]",
    "media-wide": "lg:grid-cols-[1fr_minmax(24rem,56%)]",
  },
};

const mediaSizes: Record<AuthLayoutWidthPreset, string> = {
  balanced: "(max-width: 1024px) 0vw, 50vw",
  "media-narrow": "(max-width: 1024px) 0vw, 38vw",
  "media-wide": "(max-width: 1024px) 0vw, 56vw",
};

export function AuthLayout({
  backgroundAlt = "Authentication background",
  backgroundImage = authBackground,
  children,
  className,
  contentClassName,
  logo = <Logo href="/" priority />,
  mediaClassName,
  mediaPosition = "left",
  widthPreset = "media-narrow",
}: AuthLayoutProps) {
  return (
    <main
      className={cn(
        "grid h-svh max-h-svh w-full max-w-full overflow-hidden bg-background",
        layoutGridClasses[mediaPosition][widthPreset],
        className
      )}
    >
      <aside
        className={cn(
          "relative hidden h-full min-h-0 overflow-hidden bg-muted lg:block",
          mediaPosition === "right" && "lg:order-2",
          mediaClassName
        )}
      >
        <Image
          alt={backgroundAlt}
          className="object-cover"
          fill
          priority
          sizes={mediaSizes[widthPreset]}
          src={backgroundImage}
        />
      </aside>

      <section
        className={cn(
          "relative flex h-svh min-h-0 flex-col overflow-hidden px-5 py-4 sm:px-8 sm:py-5",
          mediaPosition === "right" && "lg:order-1"
        )}
      >
        <div className="h-8 shrink-0">{logo}</div>
        <div
          className={cn(
            "mx-auto flex min-h-0 w-full flex-1 items-center justify-center py-2 sm:py-4",
            contentClassName
          )}
        >
          {children}
        </div>
      </section>
    </main>
  );
}
