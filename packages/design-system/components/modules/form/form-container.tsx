"use client";

import {
  FormRequiredFieldsProvider,
  getRequiredFieldNamesFromSchema,
} from "@xbase/design-system/components/modules/form/required-field";
import { Button } from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import { IconReload } from "@xbase/icons/tabler";
import type { ComponentProps, FormHTMLAttributes, ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface FormContainerProps<
  TFormValues extends FieldValues = FieldValues,
> extends Omit<FormHTMLAttributes<HTMLFormElement>, "form"> {
  actionsClassName?: string;
  children: ReactNode;
  containerClassName?: string;
  form: UseFormReturn<TFormValues>;
  formClassName?: string;
  formId?: string;
  onReset?: () => void;
  requiredFields?: ReadonlyArray<Path<TFormValues> | string>;
  resetButton?: boolean;
  resetButtonText?: string;
  schema?: unknown;
  submitButton?: boolean;
  submitButtonProps?: Omit<
    ComponentProps<typeof Button>,
    "children" | "form" | "type"
  >;
  submitButtonText?: string;
}

export function FormContainer<TFormValues extends FieldValues = FieldValues>({
  actionsClassName,
  children,
  containerClassName,
  form,
  formClassName,
  formId,
  onReset,
  requiredFields,
  resetButton = false,
  resetButtonText = "Reset",
  schema,
  submitButton = false,
  submitButtonProps,
  submitButtonText = "Submit",
  ...props
}: FormContainerProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFormId = formId || `form-${reactId}`;
  const [isResetting, setIsResetting] = useState(false);
  const resolvedRequiredFields = useMemo(() => {
    const names = schema
      ? getRequiredFieldNamesFromSchema(schema)
      : new Set<string>();

    for (const field of requiredFields ?? []) {
      names.add(String(field));
    }

    return names;
  }, [requiredFields, schema]);

  const handleReset = () => {
    setIsResetting(true);
    form.reset();
    onReset?.();
    window.setTimeout(() => {
      setIsResetting(false);
    }, 300);
  };

  return (
    <FormRequiredFieldsProvider requiredFields={resolvedRequiredFields}>
      <div className={cn("space-y-4 pb-2", containerClassName)}>
        <form {...props} className={formClassName} id={resolvedFormId}>
          {children}
        </form>

        {resetButton || submitButton ? (
          <div
            className={cn(
              "flex items-center justify-end gap-2",
              actionsClassName
            )}
          >
            {resetButton ? (
              <Button onClick={handleReset} type="button" variant="outline">
                {resetButtonText}
                <IconReload
                  className={cn(
                    "transition-transform duration-300",
                    isResetting && "rotate-180"
                  )}
                />
              </Button>
            ) : null}

            {submitButton ? (
              <Button
                form={resolvedFormId}
                type="submit"
                {...submitButtonProps}
              >
                {submitButtonText}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </FormRequiredFieldsProvider>
  );
}
