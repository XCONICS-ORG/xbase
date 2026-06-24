"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import { Input } from "@xbase/design-system/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@xbase/design-system/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xbase/design-system/components/ui/select";
import { Spinner } from "@xbase/design-system/components/ui/spinner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@xbase/design-system/components/ui/tabs";
import { Textarea } from "@xbase/design-system/components/ui/textarea";
import { cn } from "@xbase/design-system/lib/utils";
import { IconCircleCheck, IconCircleX } from "@xbase/icons/tabler";
import type { ChangeEvent, ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import {
  type Control,
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from "react-hook-form";

type SupportedInputType =
  | "datetime-local"
  | "email"
  | "number"
  | "password"
  | "tel"
  | "text"
  | "url";

interface FieldTransform<TFormValues extends FieldValues> {
  input?: (value: unknown) => number | string;
  output?: (
    value: string,
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>
  ) => unknown;
}

type LookupStatus = "error" | "idle" | "loading" | "success";

export interface FormFieldOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

interface FormWrappedFieldBaseProps<TFormValues extends FieldValues> {
  className?: string;
  control: Control<TFormValues>;
  controlClassName?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  disabled?: boolean;
  fieldId?: string;
  hideLabel?: boolean;
  label?: ReactNode;
  name: Path<TFormValues>;
  required?: boolean;
}

interface FormWrappedInputFieldProps<TFormValues extends FieldValues>
  extends FormWrappedFieldBaseProps<TFormValues> {
  autoCapitalize?: ComponentProps<"input">["autoCapitalize"];
  autoComplete?: ComponentProps<"input">["autoComplete"];
  inputGroupClassName?: string;
  inputGroupEndAddon?: ReactNode;
  inputGroupEndAddonClassName?: string;
  inputGroupStartAddon?: ReactNode;
  inputGroupStartAddonClassName?: string;
  inputMode?: ComponentProps<"input">["inputMode"];
  inputProps?: Omit<
    ComponentProps<typeof Input>,
    | "aria-invalid"
    | "disabled"
    | "id"
    | "name"
    | "onBlur"
    | "onChange"
    | "ref"
    | "type"
    | "value"
  >;
  inputType?: SupportedInputType;
  kind?: "input";
  lookupStatus?: LookupStatus;
  lookupStatusVisible?: boolean;
  onValueChange?: (
    rawValue: string,
    nextValue: unknown,
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>
  ) => void;
  placeholder?: string;
  transform?: FieldTransform<TFormValues>;
}

interface FormWrappedTextareaFieldProps<TFormValues extends FieldValues>
  extends FormWrappedFieldBaseProps<TFormValues> {
  enableJsonSwitcher?: boolean;
  jsonSwitcherDefaultMode?: "json" | "text";
  jsonSwitcherLabels?: {
    json?: string;
    text?: string;
  };
  jsonSwitcherModeValues?: {
    json?: string;
    text?: string;
  };
  kind: "textarea";
  onValueChange?: (
    rawValue: string,
    nextValue: unknown,
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>
  ) => void;
  placeholder?: string;
  rows?: number;
  textareaProps?: Omit<
    ComponentProps<typeof Textarea>,
    | "aria-invalid"
    | "disabled"
    | "id"
    | "name"
    | "onBlur"
    | "onChange"
    | "ref"
    | "rows"
    | "value"
  >;
  transform?: FieldTransform<TFormValues>;
}

interface FormWrappedSelectFieldProps<TFormValues extends FieldValues>
  extends FormWrappedFieldBaseProps<TFormValues> {
  contentClassName?: string;
  kind: "select";
  onValueChange?: (
    value: string,
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>
  ) => void;
  options: FormFieldOption[];
  placeholder?: string;
  triggerClassName?: string;
}

interface FormWrappedCustomFieldProps<TFormValues extends FieldValues>
  extends FormWrappedFieldBaseProps<TFormValues> {
  kind: "custom";
  render: (args: {
    disabled?: boolean;
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
    fieldId: string;
    fieldState: ControllerFieldState;
  }) => ReactNode;
}

export type FormWrappedFieldProps<TFormValues extends FieldValues> =
  | FormWrappedCustomFieldProps<TFormValues>
  | FormWrappedInputFieldProps<TFormValues>
  | FormWrappedSelectFieldProps<TFormValues>
  | FormWrappedTextareaFieldProps<TFormValues>;

export type FormWrappedInputFieldConfig<TFormValues extends FieldValues> = Omit<
  FormWrappedInputFieldProps<TFormValues>,
  "control" | "fieldId"
> & {
  id?: string;
};

export type FormWrappedTextareaFieldConfig<TFormValues extends FieldValues> =
  Omit<FormWrappedTextareaFieldProps<TFormValues>, "control" | "fieldId"> & {
    id?: string;
  };

export type FormWrappedSelectFieldConfig<TFormValues extends FieldValues> =
  Omit<FormWrappedSelectFieldProps<TFormValues>, "control" | "fieldId"> & {
    id?: string;
  };

export type FormWrappedCustomFieldConfig<TFormValues extends FieldValues> =
  Omit<FormWrappedCustomFieldProps<TFormValues>, "control" | "fieldId"> & {
    id?: string;
  };

export type FormWrappedFieldConfig<TFormValues extends FieldValues> =
  | FormWrappedCustomFieldConfig<TFormValues>
  | FormWrappedInputFieldConfig<TFormValues>
  | FormWrappedSelectFieldConfig<TFormValues>
  | FormWrappedTextareaFieldConfig<TFormValues>;

const getDefaultLabel = (name: string) => {
  const rawSegment = name.split(".").pop() ?? name;
  const withSpaces = rawSegment
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

const resolveInputValue = (
  value: unknown,
  transform?: FieldTransform<FieldValues>
): number | string => {
  if (transform?.input) {
    return transform.input(value);
  }

  if (typeof value === "number") {
    return value;
  }

  return typeof value === "string" ? value : "";
};

function LookupStatusIndicator({
  lookupStatus,
}: {
  lookupStatus?: LookupStatus;
}) {
  if (lookupStatus === "loading") {
    return <Spinner className="size-4" />;
  }

  if (lookupStatus === "success") {
    return <IconCircleCheck className="size-4 text-success" />;
  }

  if (lookupStatus === "error") {
    return <IconCircleX className="size-4 text-destructive" />;
  }

  return null;
}

function InputLookupStatusAdornment({ indicator }: { indicator: ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
      {indicator}
    </div>
  );
}

const resolveOutputValue = <TFormValues extends FieldValues>(
  rawValue: string,
  props: FormWrappedInputFieldProps<TFormValues>,
  field: ControllerRenderProps<TFormValues, Path<TFormValues>>
) => {
  if (props.transform?.output) {
    return props.transform.output(rawValue, field);
  }

  if (props.inputType === "number" && rawValue !== "") {
    return Number(rawValue);
  }

  return rawValue;
};

const getLookupStatusIndicator = <TFormValues extends FieldValues>(
  props: FormWrappedInputFieldProps<TFormValues>
) => {
  if (
    props.lookupStatusVisible === false ||
    !props.lookupStatus ||
    props.lookupStatus === "idle"
  ) {
    return null;
  }

  return <LookupStatusIndicator lookupStatus={props.lookupStatus} />;
};

function renderInputControl<TFormValues extends FieldValues>({
  disabled,
  field,
  fieldState,
  props,
  resolvedFieldId,
}: {
  disabled?: boolean;
  field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
  fieldState: ControllerFieldState;
  props: FormWrappedInputFieldProps<TFormValues>;
  resolvedFieldId: string;
}) {
  const lookupStatusIndicator = getLookupStatusIndicator(props);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const nextValue = resolveOutputValue(rawValue, props, field);

    field.onChange(nextValue);
    props.onValueChange?.(rawValue, nextValue, field);
  };
  const inputProps = {
    ...props.inputProps,
    "aria-invalid": fieldState.invalid,
    autoCapitalize: props.autoCapitalize,
    autoComplete: props.autoComplete,
    className: cn(props.controlClassName, props.inputProps?.className),
    disabled,
    id: resolvedFieldId,
    inputMode: props.inputMode,
    name: field.name,
    onBlur: field.onBlur,
    onChange: handleChange,
    placeholder: props.placeholder,
    ref: field.ref,
    type: props.inputType ?? "text",
    value: resolveInputValue(
      field.value,
      props.transform as FieldTransform<FieldValues>
    ),
  } satisfies ComponentProps<typeof Input>;

  if (
    !(
      props.inputGroupStartAddon ||
      props.inputGroupEndAddon ||
      lookupStatusIndicator
    )
  ) {
    return <Input {...inputProps} />;
  }

  if (
    !(props.inputGroupStartAddon || props.inputGroupEndAddon) &&
    lookupStatusIndicator
  ) {
    return (
      <div className="relative">
        <Input {...inputProps} className={cn("pr-10", inputProps.className)} />
        <InputLookupStatusAdornment indicator={lookupStatusIndicator} />
      </div>
    );
  }

  return (
    <InputGroup
      className={props.inputGroupClassName}
      data-disabled={disabled || undefined}
    >
      {props.inputGroupStartAddon ? (
        <InputGroupAddon
          align="inline-start"
          className={props.inputGroupStartAddonClassName}
        >
          {props.inputGroupStartAddon}
        </InputGroupAddon>
      ) : null}

      <InputGroupInput {...inputProps} />

      {props.inputGroupEndAddon ? (
        <InputGroupAddon
          align="inline-end"
          className={cn(
            lookupStatusIndicator ? "min-w-4" : undefined,
            props.inputGroupEndAddonClassName
          )}
        >
          {props.inputGroupEndAddon}
        </InputGroupAddon>
      ) : null}

      {!props.inputGroupEndAddon && lookupStatusIndicator ? (
        <InputGroupAddon align="inline-end" className="min-w-4">
          {lookupStatusIndicator}
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}

function TextareaFieldControl<TFormValues extends FieldValues>({
  disabled,
  field,
  fieldState,
  props,
  resolvedFieldId,
}: {
  disabled?: boolean;
  field: ControllerRenderProps<TFormValues, Path<TFormValues>>;
  fieldState: ControllerFieldState;
  props: FormWrappedTextareaFieldProps<TFormValues>;
  resolvedFieldId: string;
}) {
  const [mode, setMode] = useState<"json" | "text">(
    props.jsonSwitcherDefaultMode ?? "text"
  );
  const [jsonError, setJsonError] = useState<null | string>(null);
  const value = resolveInputValue(
    field.value,
    props.transform as FieldTransform<FieldValues>
  );
  const [draftValue, setDraftValue] = useState(String(value));

  const commitValue = useCallback(
    (rawValue: string) => {
      const nextValue = props.transform?.output
        ? props.transform.output(rawValue, field)
        : rawValue;

      field.onChange(nextValue);
      props.onValueChange?.(rawValue, nextValue, field);
    },
    [field, props.onValueChange, props.transform]
  );

  const validateAndCommitJson = useCallback(
    (rawValue: string) => {
      if (!rawValue.trim()) {
        setJsonError("Enter valid JSON.");
        return false;
      }

      try {
        const formattedValue = JSON.stringify(JSON.parse(rawValue), null, 2);
        setJsonError(null);

        if (formattedValue !== rawValue) {
          setDraftValue(formattedValue);
        }

        commitValue(formattedValue);
        return true;
      } catch (error) {
        setJsonError(error instanceof Error ? error.message : "Invalid JSON.");
        return false;
      }
    },
    [commitValue]
  );

  useEffect(() => {
    if (!(props.enableJsonSwitcher && mode === "json")) {
      setDraftValue(String(value));
    }
  }, [mode, props.enableJsonSwitcher, value]);

  useEffect(() => {
    if (!(props.enableJsonSwitcher && mode === "json")) {
      return;
    }

    const timeout = window.setTimeout(() => {
      validateAndCommitJson(draftValue);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [draftValue, mode, props.enableJsonSwitcher, validateAndCommitJson]);

  const handleBlur = () => {
    field.onBlur();

    if (props.enableJsonSwitcher && mode === "json") {
      validateAndCommitJson(draftValue);
    }
  };

  const textareaValue =
    props.enableJsonSwitcher && mode === "json" ? draftValue : value;

  const textarea = (
    <Textarea
      {...props.textareaProps}
      aria-invalid={fieldState.invalid || Boolean(jsonError)}
      className={cn(
        "resize-none",
        mode === "json" && "font-mono text-xs",
        props.controlClassName,
        props.textareaProps?.className
      )}
      disabled={disabled}
      id={resolvedFieldId}
      name={field.name}
      onBlur={handleBlur}
      onChange={(event) => {
        const nextValue = event.target.value;

        setJsonError(null);

        if (props.enableJsonSwitcher && mode === "json") {
          setDraftValue(nextValue);
          return;
        }

        commitValue(nextValue);
      }}
      placeholder={props.placeholder}
      ref={field.ref}
      rows={props.rows ?? 4}
      value={textareaValue}
    />
  );

  if (!props.enableJsonSwitcher) {
    return textarea;
  }

  return (
    <div className="space-y-2">
      <Tabs
        onValueChange={(nextMode) => {
          const resolvedMode = nextMode as "json" | "text";
          const modeValue = props.jsonSwitcherModeValues?.[resolvedMode];

          setMode(resolvedMode);
          setJsonError(null);

          if (typeof modeValue === "string") {
            if (resolvedMode === "json") {
              setDraftValue(modeValue);
              validateAndCommitJson(modeValue);
              return;
            }

            setDraftValue(modeValue);
            commitValue(modeValue);
            return;
          }

          setDraftValue(String(value));
        }}
        value={mode}
      >
        <TabsList>
          <TabsTrigger value="text">
            {props.jsonSwitcherLabels?.text ?? "Text"}
          </TabsTrigger>
          <TabsTrigger value="json">
            {props.jsonSwitcherLabels?.json ?? "JSON"}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {textarea}
      {jsonError ? (
        <p className="text-destructive text-xs/relaxed">{jsonError}</p>
      ) : null}
    </div>
  );
}

export function FormWrappedField<TFormValues extends FieldValues>(
  props: FormWrappedFieldProps<TFormValues>
) {
  const {
    className,
    control,
    description,
    descriptionClassName,
    disabled,
    fieldId,
    hideLabel,
    label,
    name,
  } = props;
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => {
        const fieldLabel = label ?? getDefaultLabel(String(name));

        return (
          <Field className={className} data-invalid={fieldState.invalid}>
            {hideLabel ? null : (
              <FieldLabel htmlFor={resolvedFieldId}>
                <FormFieldLabelText name={name} required={props.required}>
                  {fieldLabel}
                </FormFieldLabelText>
              </FieldLabel>
            )}

            {props.kind === "custom"
              ? props.render({
                  disabled,
                  field,
                  fieldId: resolvedFieldId,
                  fieldState,
                })
              : null}

            {props.kind === "select" ? (
              <Select
                disabled={disabled}
                onValueChange={(value) => {
                  field.onChange(value);
                  props.onValueChange?.(value, field);
                }}
                value={typeof field.value === "string" ? field.value : ""}
              >
                <SelectTrigger
                  aria-invalid={fieldState.invalid}
                  className={cn("w-full", props.triggerClassName)}
                  id={resolvedFieldId}
                >
                  <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
                <SelectContent className={props.contentClassName}>
                  {props.options.map((option) => (
                    <SelectItem
                      disabled={option.disabled}
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {props.kind === "textarea" ? (
              <TextareaFieldControl
                disabled={disabled}
                field={field}
                fieldState={fieldState}
                props={props}
                resolvedFieldId={resolvedFieldId}
              />
            ) : null}

            {props.kind === undefined || props.kind === "input"
              ? renderInputControl({
                  disabled,
                  field,
                  fieldState,
                  props,
                  resolvedFieldId,
                })
              : null}

            {description ? (
              <FieldDescription className={descriptionClassName}>
                {description}
              </FieldDescription>
            ) : null}

            <FieldError errors={[fieldState.error]} />
          </Field>
        );
      }}
    />
  );
}
