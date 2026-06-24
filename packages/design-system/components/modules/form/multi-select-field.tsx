"use client";

import { CheckIcon } from "@phosphor-icons/react";
import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import { Badge } from "@xbase/design-system/components/ui/badge";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import { cn } from "@xbase/design-system/lib/utils";
import type { ReactNode } from "react";
import { useId } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface MultiSelectOption {
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface MultiSelectFieldProps<TFormValues extends FieldValues> {
  className?: string;
  control: Control<TFormValues>;
  description?: ReactNode;
  disabled?: boolean;
  fieldId?: string;
  label?: ReactNode;
  name: Path<TFormValues>;
  options: MultiSelectOption[];
  placeholder?: ReactNode;
  required?: boolean;
}

const toStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

export function MultiSelectField<TFormValues extends FieldValues>({
  className,
  control,
  description,
  disabled,
  fieldId,
  label,
  name,
  options,
  placeholder = "No options selected",
  required,
}: MultiSelectFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => {
        const value = toStringArray(field.value);
        const selectedOptions = options.filter((option) =>
          value.includes(option.value)
        );
        const setOptionValue = (optionValue: string, nextChecked: boolean) => {
          const nextValue = nextChecked
            ? Array.from(new Set([...value, optionValue]))
            : value.filter((item) => item !== optionValue);

          field.onChange(nextValue);
        };

        return (
          <Field
            className={className}
            data-disabled={disabled || undefined}
            data-invalid={fieldState.invalid}
          >
            {label ? (
              <FieldLabel htmlFor={resolvedFieldId}>
                <FormFieldLabelText name={name} required={required}>
                  {label}
                </FormFieldLabelText>
              </FieldLabel>
            ) : null}
            <div
              className="grid gap-2 rounded-md border bg-background p-2"
              id={resolvedFieldId}
            >
              <div className="flex min-h-7 flex-wrap items-center gap-1.5">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <Badge key={option.value} variant="secondary">
                      {option.label}
                    </Badge>
                  ))
                ) : (
                  <span className="px-1 text-muted-foreground text-xs">
                    {placeholder}
                  </span>
                )}
              </div>
              <div className="grid gap-1 sm:grid-cols-2">
                {options.map((option, index) => {
                  const checked = value.includes(option.value);
                  const optionDisabled = disabled || option.disabled;

                  return (
                    <label
                      className={cn(
                        "flex min-h-9 cursor-pointer items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted/70",
                        checked && "bg-muted",
                        optionDisabled &&
                          "cursor-not-allowed opacity-50 hover:bg-transparent"
                      )}
                      key={option.value}
                    >
                      <input
                        checked={checked}
                        className="peer sr-only"
                        disabled={optionDisabled}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(event) =>
                          setOptionValue(
                            option.value,
                            event.currentTarget.checked
                          )
                        }
                        ref={index === 0 ? field.ref : undefined}
                        type="checkbox"
                        value={option.value}
                      />
                      <span
                        aria-hidden
                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border border-input outline-none transition-shadow peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30"
                      >
                        {checked ? <CheckIcon className="size-3.5" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium">
                          {option.label}
                        </span>
                        {option.description ? (
                          <span className="block text-muted-foreground">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            {description ? (
              <FieldDescription>{description}</FieldDescription>
            ) : null}
            <FieldError errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}
