"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import {
  PasswordInput,
  type PasswordInputProps,
} from "@xbase/design-system/components/ui/password-input";
import { type ReactNode, useId } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface PasswordInputFieldProps<TFormValues extends FieldValues>
  extends Omit<
    PasswordInputProps,
    | "aria-invalid"
    | "className"
    | "disabled"
    | "id"
    | "name"
    | "onBlur"
    | "onChange"
    | "ref"
    | "value"
  > {
  className?: string;
  control: Control<TFormValues>;
  controlClassName?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  endAddon?: ReactNode;
  fieldId?: string;
  label?: React.ReactNode;
  name: Path<TFormValues>;
  required?: boolean;
}

export function PasswordInputField<TFormValues extends FieldValues>({
  className,
  control,
  controlClassName,
  description,
  disabled,
  endAddon,
  fieldId,
  label,
  name,
  required,
  ...inputProps
}: PasswordInputFieldProps<TFormValues>) {
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
          <PasswordInput
            {...inputProps}
            aria-invalid={fieldState.invalid}
            className={controlClassName}
            disabled={disabled}
            endAddon={endAddon}
            id={resolvedFieldId}
            name={field.name}
            onBlur={field.onBlur}
            onChange={field.onChange}
            ref={field.ref}
            value={typeof field.value === "string" ? field.value : ""}
          />
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
