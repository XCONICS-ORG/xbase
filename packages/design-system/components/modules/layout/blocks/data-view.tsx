/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: Multi-format display component uses explicit mode branches. */

"use client";

import {
  CopyButton,
  type CopyButtonProps,
} from "@xbase/design-system/components/modules/layout/blocks/copy-button";
import { Badge } from "@xbase/design-system/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@xbase/design-system/components/ui/input-group";
import { cn } from "@xbase/design-system/lib/utils";
import { Eye, EyeOff, ImageOff } from "@xbase/icons/lucide";
import {
  type DateTimeInput,
  type FormatDateTimeOptions,
  formatDate,
  formatDateTime,
  formatTime,
} from "@xbase/utility/formatters";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { type ReactNode, useMemo, useState } from "react";

export type DataViewValue = unknown;

export type DataViewType =
  | "boolean"
  | "code"
  | "currency"
  | "date"
  | "datetime"
  | "email"
  | "image"
  | "json"
  | "longtext"
  | "number"
  | "password"
  | "phone"
  | "text"
  | "time"
  | "url";

export type DataViewPresentation =
  | "auto"
  | "badge"
  | "field"
  | "plain"
  | "text";

interface DataViewRenderContext {
  displayValue: string;
  isEmpty: boolean;
  type: DataViewType;
}

type DataViewCopyOptions = Omit<CopyButtonProps, "value"> & {
  value?: string | ((context: DataViewRenderContext) => string);
};

const dataViewVariants = cva("min-w-0", {
  variants: {
    density: {
      compact: "gap-1",
      default: "gap-1.5",
      relaxed: "gap-2",
    },
    variant: {
      card: "flex flex-col rounded-md border bg-card p-3",
      default: "flex flex-col",
      inline:
        "grid grid-cols-1 items-start gap-x-4 gap-y-1 sm:grid-cols-[minmax(8rem,0.35fr)_minmax(0,1fr)]",
      plain: "flex flex-col",
      subtle: "flex flex-col rounded-md bg-muted/35 p-3",
    },
  },
  defaultVariants: {
    density: "default",
    variant: "default",
  },
});

export interface DataViewProps extends VariantProps<typeof dataViewVariants> {
  booleanLabels?: {
    false: ReactNode;
    true: ReactNode;
  };
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  copy?: boolean | DataViewCopyOptions;
  copyButtonClassName?: string;
  currency?: string;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  dateOptions?: FormatDateTimeOptions;
  emptyValue?: ReactNode;
  enableCopy?: boolean;
  formatValue?: (
    value: DataViewValue,
    context: Omit<DataViewRenderContext, "displayValue">
  ) => ReactNode;
  hideWhenEmpty?: boolean;
  imageAlt?: string;
  imageClassName?: string;
  label?: ReactNode;
  labelClassName?: string;
  locale?: string;
  numberFormatOptions?: Intl.NumberFormatOptions;
  placeholderImage?: string;
  prefix?: ReactNode;
  presentation?: DataViewPresentation;
  renderValue?: (context: DataViewRenderContext) => ReactNode;
  rows?: number;
  showTime?: boolean;
  suffix?: ReactNode;
  type?: DataViewType;
  value?: DataViewValue;
  valueClassName?: string;
  valueLabel?: ReactNode;
  valueType?: DataViewType;
}

const defaultBooleanLabels = {
  false: "No",
  true: "Yes",
};

function isDateTimeInput(value: DataViewValue): value is DateTimeInput {
  return (
    value instanceof Date ||
    typeof value === "number" ||
    typeof value === "string"
  );
}

function isEmptyValue(value: DataViewValue) {
  return value === null || value === undefined || value === "";
}

function formatJsonValue(value: DataViewValue) {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  return JSON.stringify(value, null, 2);
}

function formatDisplayValue({
  booleanLabels = defaultBooleanLabels,
  currency,
  dateFormatOptions,
  dateOptions,
  formatValue,
  locale,
  numberFormatOptions,
  showTime,
  type,
  value,
}: Pick<
  DataViewProps,
  | "booleanLabels"
  | "currency"
  | "dateFormatOptions"
  | "dateOptions"
  | "formatValue"
  | "locale"
  | "numberFormatOptions"
  | "showTime"
  | "type"
  | "value"
>) {
  const isEmpty = isEmptyValue(value);

  if (formatValue) {
    const formatted = formatValue(value, { isEmpty, type: type ?? "text" });
    return typeof formatted === "string" || typeof formatted === "number"
      ? String(formatted)
      : formatted;
  }

  if (isEmpty) {
    return "";
  }

  if (type === "boolean" || typeof value === "boolean") {
    return value ? booleanLabels.true : booleanLabels.false;
  }

  if (
    (type === "date" || type === "datetime" || type === "time") &&
    isDateTimeInput(value)
  ) {
    if (dateFormatOptions) {
      return new Intl.DateTimeFormat(locale, dateFormatOptions).format(
        new Date(value)
      );
    }

    if (type === "time") {
      return formatTime(value, dateOptions);
    }

    if (type === "date" && !showTime) {
      return formatDate(value, dateOptions);
    }

    return formatDateTime(value, dateOptions);
  }

  if (type === "currency" && typeof value === "number") {
    return new Intl.NumberFormat(locale, {
      currency: currency ?? "USD",
      style: "currency",
      ...numberFormatOptions,
    }).format(value);
  }

  if (type === "number" && typeof value === "number") {
    return new Intl.NumberFormat(locale, numberFormatOptions).format(value);
  }

  if (type === "json") {
    return formatJsonValue(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function resolvePresentation(
  type: DataViewType,
  presentation: DataViewPresentation
) {
  if (presentation !== "auto") {
    return presentation;
  }

  if (type === "boolean") {
    return "badge";
  }

  if (type === "code" || type === "json") {
    return "plain";
  }

  return "field";
}

export function DataViewBlock({
  booleanLabels = defaultBooleanLabels,
  children,
  className,
  contentClassName,
  copy,
  copyButtonClassName,
  currency,
  dateFormatOptions,
  dateOptions,
  density,
  emptyValue = "-",
  enableCopy = false,
  formatValue,
  hideWhenEmpty = false,
  imageAlt,
  imageClassName,
  label,
  labelClassName,
  locale,
  numberFormatOptions,
  placeholderImage,
  prefix,
  presentation = "auto",
  renderValue,
  rows = 4,
  showTime = false,
  suffix,
  type = "text",
  value,
  valueClassName,
  valueLabel,
  valueType,
  variant,
}: DataViewProps) {
  const [imageError, setImageError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = valueType ?? type;
  const isEmpty = isEmptyValue(value);

  const formattedValue = useMemo(
    () =>
      formatDisplayValue({
        booleanLabels,
        currency,
        dateFormatOptions,
        dateOptions,
        formatValue,
        locale,
        numberFormatOptions,
        showTime,
        type: resolvedType,
        value,
      }),
    [
      booleanLabels,
      currency,
      dateFormatOptions,
      dateOptions,
      formatValue,
      locale,
      numberFormatOptions,
      resolvedType,
      showTime,
      value,
    ]
  );

  const displayValue =
    typeof formattedValue === "string" || typeof formattedValue === "number"
      ? String(formattedValue)
      : "";
  const context = { displayValue, isEmpty, type: resolvedType };

  if (hideWhenEmpty && !children && resolvedType !== "image" && isEmpty) {
    return null;
  }

  const resolvedLabel = label ?? valueLabel;
  const copyOptions = typeof copy === "object" ? copy : {};
  const {
    children: copyOptionsChildren,
    className: copyOptionsClassName,
    showLabel: copyOptionsShowLabel,
    value: copyOptionValue,
    ...copyButtonOptions
  } = copyOptions;
  const copyEnabled = Boolean(copy || enableCopy);
  const copyValue =
    typeof copyOptionValue === "function"
      ? copyOptionValue(context)
      : (copyOptionValue ?? displayValue);
  const selectedPresentation = resolvePresentation(resolvedType, presentation);
  const fieldValue = displayValue || String(emptyValue);
  const copyInlineWithField =
    copyEnabled &&
    !children &&
    !renderValue &&
    (selectedPresentation === "field" ||
      resolvedType === "longtext" ||
      resolvedType === "json");

  const renderCopyButton = (inline = false) => (
    <CopyButton
      {...copyButtonOptions}
      className={cn(
        "shrink-0",
        inline && "size-6 p-0 has-[>svg]:p-0",
        copyButtonClassName,
        copyOptionsClassName
      )}
      showLabel={inline ? false : copyOptionsShowLabel}
      size={inline ? "icon-xs" : undefined}
      value={copyValue}
      variant={inline ? "ghost" : "outline"}
    >
      {inline ? undefined : copyOptionsChildren}
    </CopyButton>
  );

  const renderPasswordToggle = () => (
    <InputGroupButton
      aria-label={showPassword ? "Hide password" : "Show password"}
      onClick={() => setShowPassword((current) => !current)}
      size="icon-xs"
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          className="inline-flex"
          exit={{ opacity: 0, rotate: showPassword ? -10 : 10, scale: 0.82 }}
          initial={{ opacity: 0, rotate: showPassword ? 10 : -10, scale: 0.82 }}
          key={showPassword ? "hide-password" : "show-password"}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {showPassword ? (
            <EyeOff className="size-3.5 stroke-[1.5px]" />
          ) : (
            <Eye className="size-3.5 stroke-[1.5px]" />
          )}
        </motion.span>
      </AnimatePresence>
    </InputGroupButton>
  );

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (renderValue) {
      return renderValue(context);
    }

    if (resolvedType === "image") {
      const imageSource = typeof value === "string" ? value : "";
      const shouldShowImage = imageSource.length > 0 && !imageError;
      let imageContent: ReactNode = (
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <ImageOff className="size-8 stroke-[1.5px]" />
          <span className="text-xs">
            {imageError ? "Failed to load image" : "No image available"}
          </span>
        </div>
      );

      if (placeholderImage && !shouldShowImage) {
        imageContent = (
          <Image
            alt="No data available"
            className={cn("object-contain p-2 opacity-40", imageClassName)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src={placeholderImage}
            unoptimized
          />
        );
      }

      if (shouldShowImage) {
        imageContent = (
          <Image
            alt={
              imageAlt ??
              (typeof resolvedLabel === "string"
                ? resolvedLabel
                : "Image preview")
            }
            className={cn("object-contain p-2", imageClassName)}
            fill
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, 50vw"
            src={imageSource}
            unoptimized
          />
        );
      }

      return (
        <div
          className={cn(
            "relative flex h-32 min-h-32 w-full items-center justify-center overflow-hidden rounded-md border bg-muted/30",
            valueClassName
          )}
        >
          {imageContent}
        </div>
      );
    }

    if (resolvedType === "longtext" || resolvedType === "json") {
      return (
        <InputGroup className="h-auto bg-muted/20">
          <InputGroupTextarea
            aria-label={
              typeof resolvedLabel === "string" ? resolvedLabel : undefined
            }
            className={cn("min-h-24", valueClassName)}
            readOnly
            rows={rows}
            value={fieldValue}
          />
          {copyInlineWithField ? (
            <InputGroupAddon align="block-end" className="justify-end border-t">
              {renderCopyButton(true)}
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      );
    }

    if (selectedPresentation === "badge") {
      return (
        <Badge className={cn("w-fit", valueClassName)} variant="secondary">
          {formattedValue || emptyValue}
        </Badge>
      );
    }

    if (selectedPresentation === "plain" || selectedPresentation === "text") {
      return (
        <div
          className={cn(
            "min-h-8 min-w-0 rounded-md py-1.5 text-sm md:text-xs/relaxed",
            selectedPresentation === "plain" && "font-mono",
            valueClassName
          )}
        >
          <span className="wrap-break-word">
            {prefix}
            {formattedValue || emptyValue}
            {suffix}
          </span>
        </div>
      );
    }

    const hasInlineEndAddon =
      Boolean(suffix) || resolvedType === "password" || copyInlineWithField;

    return (
      <InputGroup className="bg-muted/20">
        {prefix ? (
          <InputGroupAddon align="inline-start">
            <InputGroupText>{prefix}</InputGroupText>
          </InputGroupAddon>
        ) : null}
        <InputGroupInput
          aria-label={
            typeof resolvedLabel === "string" ? resolvedLabel : undefined
          }
          className={cn("cursor-default", valueClassName)}
          readOnly
          type={
            resolvedType === "password" && !showPassword ? "password" : "text"
          }
          value={fieldValue}
        />
        {hasInlineEndAddon ? (
          <InputGroupAddon align="inline-end">
            {suffix ? <InputGroupText>{suffix}</InputGroupText> : null}
            {resolvedType === "password" ? renderPasswordToggle() : null}
            {copyInlineWithField ? renderCopyButton(true) : null}
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    );
  };

  return (
    <div className={cn(dataViewVariants({ density, variant }), className)}>
      {resolvedLabel ? (
        <div
          className={cn(
            "min-w-0 font-medium text-muted-foreground text-xs",
            variant === "inline" && "pt-1.5",
            labelClassName
          )}
        >
          {resolvedLabel}
        </div>
      ) : null}
      <div
        className={cn(
          "flex min-w-0 items-start gap-1.5",
          ["image", "json", "longtext"].includes(resolvedType)
            ? "items-start"
            : "items-center",
          contentClassName
        )}
      >
        <div className="min-w-0 flex-1">{renderContent()}</div>
        {copyEnabled && !copyInlineWithField ? renderCopyButton() : null}
      </div>
    </div>
  );
}

export { DataViewBlock as DataView };
