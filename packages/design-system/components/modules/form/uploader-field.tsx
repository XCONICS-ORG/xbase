"use client";

import type { UploadedFileRecord } from "@xbase/bucket/client";
import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  AdvancedUploader,
  type AdvancedUploaderProps,
} from "@xbase/design-system/components/modules/uploader";
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
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface UploaderFieldProps<TFormValues extends FieldValues>
  extends Omit<
    AdvancedUploaderProps,
    "description" | "disabled" | "label" | "onValueChange" | "value"
  > {
  className?: string;
  control: Control<TFormValues>;
  description?: ReactNode;
  deserialize?: (value: unknown) => UploadedFileRecord[];
  disabled?: boolean;
  fieldId?: string;
  label?: ReactNode;
  name: Path<TFormValues>;
  onFilesChange?: (files: UploadedFileRecord[]) => void;
  required?: boolean;
  serialize?: (
    files: UploadedFileRecord[],
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>
  ) => unknown;
}

const defaultDeserialize = (value: unknown) =>
  Array.isArray(value) ? (value.filter(Boolean) as UploadedFileRecord[]) : [];

export function UploaderField<TFormValues extends FieldValues>({
  className,
  control,
  description,
  deserialize = defaultDeserialize,
  disabled,
  fieldId,
  label,
  name,
  onFilesChange,
  required,
  serialize,
  ...uploaderProps
}: UploaderFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => {
        const files = deserialize(field.value);

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
            <AdvancedUploader
              {...uploaderProps}
              description={
                typeof description === "string" ? description : undefined
              }
              disabled={disabled}
              label={undefined}
              onValueChange={(nextFiles) => {
                field.onChange(
                  serialize ? serialize(nextFiles, field) : nextFiles
                );
                onFilesChange?.(nextFiles);
              }}
              value={files}
            />
            {description && typeof description !== "string" ? (
              <FieldDescription>{description}</FieldDescription>
            ) : null}
            <FieldError errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}
