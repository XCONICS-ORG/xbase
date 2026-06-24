"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import { Switch } from "@xbase/design-system/components/ui/switch";
import { cn } from "@xbase/design-system/lib/utils";
import type { ReactNode } from "react";
import { useId } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface SwitchFieldProps {
  checked: boolean;
  className?: string;
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
}

export function SwitchField({
  checked,
  className,
  description,
  disabled,
  label,
  onCheckedChange,
  required,
}: SwitchFieldProps) {
  return (
    <Field
      className={cn(
        "min-h-9 justify-between gap-3 border bg-background px-3 py-2",
        className
      )}
      data-disabled={disabled || undefined}
      orientation="horizontal"
    >
      <div className="min-w-0 space-y-1">
        <FieldLabel className="w-auto leading-none">
          <FormFieldLabelText required={required}>{label}</FormFieldLabelText>
        </FieldLabel>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </div>
      <Switch
        checked={checked}
        className="w-8 flex-none"
        disabled={disabled}
        onCheckedChange={onCheckedChange}
      />
    </Field>
  );
}

export interface FormSwitchFieldProps<TFormValues extends FieldValues> {
  className?: string;
  control: Control<TFormValues>;
  description?: ReactNode;
  disabled?: boolean;
  fieldId?: string;
  label: ReactNode;
  name: Path<TFormValues>;
  required?: boolean;
}

export function FormSwitchField<TFormValues extends FieldValues>({
  className,
  control,
  description,
  disabled,
  fieldId,
  label,
  name,
  required,
}: FormSwitchFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          className={cn(
            "min-h-9 justify-between gap-3 border bg-background px-3 py-2",
            className
          )}
          data-disabled={disabled || undefined}
          data-invalid={fieldState.invalid}
          orientation="horizontal"
        >
          <div className="min-w-0 space-y-1">
            <FieldLabel
              className="w-auto leading-none"
              htmlFor={resolvedFieldId}
            >
              <FormFieldLabelText name={name} required={required}>
                {label}
              </FormFieldLabelText>
            </FieldLabel>
            {description ? (
              <FieldDescription>{description}</FieldDescription>
            ) : null}
            <FieldError errors={[fieldState.error]} />
          </div>
          <Switch
            checked={Boolean(field.value)}
            className="w-8 flex-none"
            disabled={disabled}
            id={resolvedFieldId}
            onCheckedChange={field.onChange}
          />
        </Field>
      )}
    />
  );
}
