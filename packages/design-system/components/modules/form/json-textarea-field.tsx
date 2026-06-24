"use client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import { Textarea } from "@xbase/design-system/components/ui/textarea";
import { cn } from "@xbase/design-system/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface JsonTextareaFieldProps<TFormValues extends FieldValues> {
  className?: string;
  control: Control<TFormValues>;
  description?: ReactNode;
  disabled?: boolean;
  fieldId?: string;
  label?: ReactNode;
  name: Path<TFormValues>;
  placeholder?: string;
  rows?: number;
}

const stringifyJson = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value === undefined || value === null) {
    return "";
  }

  return JSON.stringify(value, null, 2);
};

function JsonTextareaControl({
  disabled,
  fieldId,
  invalid,
  onBlur,
  onChange,
  placeholder,
  rows,
  value,
}: {
  disabled?: boolean;
  fieldId: string;
  invalid?: boolean;
  onBlur: () => void;
  onChange: (value: unknown) => void;
  placeholder?: string;
  rows?: number;
  value: unknown;
}) {
  const [draft, setDraft] = useState(() => stringifyJson(value));
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(stringifyJson(value));
    setParseError(null);
  }, [value]);

  const commitDraft = () => {
    onBlur();

    if (!draft.trim()) {
      setParseError(null);
      onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(draft) as unknown;
      setParseError(null);
      onChange(parsed);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Invalid JSON.");
    }
  };

  return (
    <>
      <Textarea
        aria-invalid={invalid || Boolean(parseError)}
        className={cn("font-mono text-xs", parseError && "border-destructive")}
        disabled={disabled}
        id={fieldId}
        onBlur={commitDraft}
        onChange={(event) => {
          setDraft(event.target.value);
          if (parseError) {
            setParseError(null);
          }
        }}
        placeholder={placeholder}
        rows={rows ?? 8}
        value={draft}
      />
      {parseError ? (
        <p className="text-destructive text-xs/relaxed">{parseError}</p>
      ) : null}
    </>
  );
}

export function JsonTextareaField<TFormValues extends FieldValues>({
  className,
  control,
  description,
  disabled,
  fieldId,
  label,
  name,
  placeholder = '{\n  "key": "value"\n}',
  rows,
}: JsonTextareaFieldProps<TFormValues>) {
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
            <FieldLabel htmlFor={resolvedFieldId}>{label}</FieldLabel>
          ) : null}
          <JsonTextareaControl
            disabled={disabled}
            fieldId={resolvedFieldId}
            invalid={fieldState.invalid}
            onBlur={field.onBlur}
            onChange={field.onChange}
            placeholder={placeholder}
            rows={rows}
            value={field.value}
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
