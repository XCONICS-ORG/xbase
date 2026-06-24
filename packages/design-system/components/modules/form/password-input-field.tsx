"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import { Input } from "@xbase/design-system/components/ui/input";
import { cn } from "@xbase/design-system/lib/utils";
import { IconEye, IconEyeOff } from "@xbase/icons/tabler";
import { type ComponentProps, type ReactNode, useId, useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

type PasswordInputControlProps = Omit<ComponentProps<typeof Input>, "type"> & {
  endAddon?: ReactNode;
};

function PasswordInputControl({
  className,
  endAddon,
  ...props
}: PasswordInputControlProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        className={cn(endAddon ? "pr-16" : "pr-9", className)}
        type={showPassword ? "text" : "password"}
        {...props}
      />
      <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1">
        {endAddon}
        <button
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          onClick={() => setShowPassword((current) => !current)}
          type="button"
        >
          {showPassword ? (
            <IconEye className="size-3.5" />
          ) : (
            <IconEyeOff className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export interface PasswordInputFieldProps<TFormValues extends FieldValues>
  extends Omit<
    PasswordInputControlProps,
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
          <PasswordInputControl
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
