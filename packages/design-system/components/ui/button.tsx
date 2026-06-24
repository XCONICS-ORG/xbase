import { cn } from "@xbase/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Link, { type LinkProps } from "next/dist/client/link";
import { Slot } from "radix-ui";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
} from "react";
import { Spinner } from "@xbase/design-system/components/ui/spinner";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-clip-padding font-medium text-xs/relaxed outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = ButtonVariantProps &
  HTMLAttributes<HTMLElement> &
  Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "disabled"
    | "form"
    | "formAction"
    | "formEncType"
    | "formMethod"
    | "formNoValidate"
    | "formTarget"
    | "name"
    | "type"
    | "value"
  > &
  Partial<
    Pick<LinkProps, "locale" | "prefetch" | "replace" | "scroll" | "shallow">
  > & {
    asChild?: boolean;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    href?: LinkProps["href"];
    leftIcon?: ReactNode;
    loading?: boolean;
    loadingIcon?: ReactNode;
    loadingState?: boolean;
    loadingText?: string;
    onClick?: MouseEventHandler<HTMLElement>;
    ref?: Ref<HTMLAnchorElement | HTMLButtonElement>;
    rightIcon?: ReactNode;
    target?: "_blank" | "_self" | "_parent" | "_top";
  };

function Button({
  asChild = false,
  children,
  className,
  disabled = false,
  href,
  target,
  leftIcon,
  loading,
  loadingIcon,
  loadingState,
  loadingText,
  ref,
  rightIcon,
  size = "default",
  variant = "default",
  ...props
}: ButtonProps) {
  const isLoading = loadingState ?? loading ?? false;
  const resolvedLoadingIcon = loadingIcon ?? <Spinner />;
  const classes = cn(buttonVariants({ variant, size, className }));

  const content = (
    <>
      {isLoading ? (
        <>
          {leftIcon && (
            <span aria-hidden="true" data-icon="inline-start">
              {resolvedLoadingIcon}
            </span>
          )}
          {loadingText ?? children}
          {rightIcon && (
            <span aria-hidden="true" data-icon="inline-start">
              {resolvedLoadingIcon}
            </span>
          )}

          {!(leftIcon || rightIcon) && (
            <span aria-hidden="true" data-icon="inline-start">
              {resolvedLoadingIcon}
            </span>
          )}
        </>
      ) : (
        <>
          {leftIcon ? (
            <span aria-hidden="true" data-icon="inline-start">
              {leftIcon}
            </span>
          ) : null}
          {children}
          {rightIcon ? (
            <span aria-hidden="true" data-icon="inline-end">
              {rightIcon}
            </span>
          ) : null}
        </>
      )}
    </>
  );

  if (href) {
    const linkProps = props as Omit<
      ButtonProps,
      | "asChild"
      | "children"
      | "className"
      | "disabled"
      | "href"
      | "leftIcon"
      | "loading"
      | "loadingIcon"
      | "loadingState"
      | "loadingText"
      | "onClick"
      | "ref"
      | "rightIcon"
      | "size"
      | "variant"
    >;

    return (
      <Link
        aria-busy={isLoading || undefined}
        aria-disabled={isLoading || undefined}
        className={classes}
        data-size={size}
        data-slot="button"
        data-variant={variant}
        href={href}
        onClick={
          props.onClick as MouseEventHandler<HTMLAnchorElement> | undefined
        }
        ref={ref as unknown as Ref<HTMLAnchorElement> | undefined}
        tabIndex={isLoading ? -1 : linkProps.tabIndex}
        target={target}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps = props as Omit<
    ButtonProps,
    | "asChild"
    | "children"
    | "className"
    | "disabled"
    | "href"
    | "leftIcon"
    | "loading"
    | "loadingIcon"
    | "loadingState"
    | "loadingText"
    | "onClick"
    | "ref"
    | "rightIcon"
    | "size"
    | "variant"
  >;

  if (asChild) {
    return (
      <Slot.Root
        className={classes}
        data-size={size}
        data-slot="button"
        data-variant={variant}
        onClick={
          props.onClick as MouseEventHandler<HTMLButtonElement> | undefined
        }
        ref={ref as unknown as Ref<HTMLButtonElement> | undefined}
        {...buttonProps}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      aria-busy={isLoading || undefined}
      className={classes}
      data-size={size}
      data-slot="button"
      data-variant={variant}
      disabled={isLoading || disabled}
      onClick={
        props.onClick as MouseEventHandler<HTMLButtonElement> | undefined
      }
      ref={ref as unknown as Ref<HTMLButtonElement> | undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export type { ButtonProps };
export { Button, buttonVariants };
