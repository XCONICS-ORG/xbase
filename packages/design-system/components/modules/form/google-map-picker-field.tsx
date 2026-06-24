"use client";

import {
  GoogleMapPicker,
  type GoogleMapPickerProps,
  type GoogleMapPickerValue,
} from "@xbase/design-system/components/modules/featured";
import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import type { ReactNode } from "react";
import { useId } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface GoogleMapPickerFieldProps<TFormValues extends FieldValues>
  extends Omit<
    GoogleMapPickerProps,
    "address" | "latitude" | "longitude" | "onChange"
  > {
  className?: string;
  control: Control<TFormValues>;
  description?: ReactNode;
  disabled?: boolean;
  fieldId?: string;
  label?: ReactNode;
  name: Path<TFormValues>;
  required?: boolean;
}

const toPickerValue = (value: unknown): Partial<GoogleMapPickerValue> => {
  if (!(value && typeof value === "object")) {
    return {};
  }

  const record = value as Partial<GoogleMapPickerValue>;
  return {
    address: record.address,
    latitude: record.latitude,
    longitude: record.longitude,
  };
};

export function GoogleMapPickerField<TFormValues extends FieldValues>({
  className,
  control,
  description,
  disabled,
  fieldId,
  label,
  name,
  required,
  ...pickerProps
}: GoogleMapPickerFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => {
        const pickerValue = toPickerValue(field.value);

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
            <div id={resolvedFieldId}>
              <GoogleMapPicker
                {...pickerProps}
                address={pickerValue.address}
                latitude={pickerValue.latitude}
                longitude={pickerValue.longitude}
                onChange={field.onChange}
              />
            </div>
            {disabled ? (
              <FieldDescription>Map picker is disabled.</FieldDescription>
            ) : null}
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
