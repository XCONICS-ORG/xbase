import logoCircleSvg from "@xbase/assets/logos/circle.svg";
import logoTextSvg from "@xbase/assets/logos/text.svg";
import { cn } from "@xbase/design-system/lib/utils";
import Image, { type ImageProps } from "next/image";

const logoVariants = {
  text: {
    src: logoTextSvg,
    width: 143,
    height: 18,
    sizes: "(max-width: 768px) 9rem, 15rem",
  },
  circle: {
    src: logoCircleSvg,
    width: 316,
    height: 266,
    sizes: "(max-width: 768px) 3.5rem, 5rem",
  },
} as const;

export type LogoVariant = keyof typeof logoVariants;

export interface LogoProps
  extends Omit<ImageProps, "alt" | "height" | "src" | "width"> {
  alt?: string;
  height?: number;
  href?: string;
  src?: ImageProps["src"] | string;
  variant?: LogoVariant;
  width?: number;
}

export function Logo({
  alt = "Xbase logo",
  className,
  height,
  href = "/",
  priority = false,
  sizes,
  src,
  unoptimized,
  variant = "text",
  width,
  ...props
}: LogoProps) {
  const variantConfig = logoVariants[variant];
  const resolvedSource = src ?? variantConfig.src;
  const isSvgSource =
    typeof resolvedSource === "string" && resolvedSource.endsWith(".svg");
  const image = (
    <Image
      alt={alt}
      className={cn(
        "pointer-events-none h-auto w-auto select-none object-contain",
        className
      )}
      height={height ?? variantConfig.height}
      priority={priority}
      sizes={sizes ?? variantConfig.sizes}
      src={resolvedSource}
      unoptimized={unoptimized ?? isSvgSource}
      width={width ?? variantConfig.width}
      {...props}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <a aria-label="Go to home page" href={href} tabIndex={-1}>
      {image}
    </a>
  );
}
