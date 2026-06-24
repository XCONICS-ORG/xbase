"use client";

import { FormFieldLabelText } from "@xbase/design-system/components/modules/form/required-field";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@xbase/design-system/components/ui/field";
import { Textarea } from "@xbase/design-system/components/ui/textarea";
import { cn } from "@xbase/design-system/lib/utils";
import { IconPlus, IconTrash } from "@xbase/icons/tabler";
import type { ReactNode } from "react";
import { useId } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface BlockListFieldProps<TFormValues extends FieldValues> {
  addButtonText?: string;
  className?: string;
  control: Control<TFormValues>;
  createBlock?: () => string;
  description?: ReactNode;
  disabled?: boolean;
  fieldId?: string;
  label?: ReactNode;
  name: Path<TFormValues>;
  placeholder?: string;
  renderBlock?: (args: {
    disabled?: boolean;
    fieldId: string;
    index: number;
    onChange: (value: string) => void;
    onRemove: () => void;
    value: string;
  }) => ReactNode;
  required?: boolean;
}

const toStringBlocks = (value: unknown) =>
  Array.isArray(value)
    ? value.map((item) =>
        typeof item === "string" ? item : String(item ?? "")
      )
    : [];

export function BlockListField<TFormValues extends FieldValues>({
  addButtonText = "Add block",
  className,
  control,
  createBlock = () => "",
  description,
  disabled,
  fieldId,
  label,
  name,
  placeholder = "Write block content",
  required,
  renderBlock,
}: BlockListFieldProps<TFormValues>) {
  const reactId = useId().replaceAll(":", "");
  const resolvedFieldId =
    fieldId ?? `${String(name).replace(/\W+/g, "-")}-${reactId}`;

  return (
    <Controller
      control={control}
      disabled={disabled}
      name={name}
      render={({ field, fieldState }) => {
        const blocks = toStringBlocks(field.value);

        const commitBlock = (index: number, nextValue: string) => {
          field.onChange(
            blocks.map((block, blockIndex) =>
              blockIndex === index ? nextValue : block
            )
          );
        };

        const removeBlock = (index: number) => {
          field.onChange(
            blocks.filter((_, blockIndex) => blockIndex !== index)
          );
        };

        return (
          <Field
            className={className}
            data-disabled={disabled || undefined}
            data-invalid={fieldState.invalid}
          >
            <div className="flex items-center justify-between gap-3">
              {label ? (
                <FieldLabel htmlFor={resolvedFieldId}>
                  <FormFieldLabelText name={name} required={required}>
                    {label}
                  </FormFieldLabelText>
                </FieldLabel>
              ) : null}
              <Button
                disabled={disabled}
                leftIcon={<IconPlus />}
                onClick={() => field.onChange([...blocks, createBlock()])}
                size="sm"
                type="button"
                variant="outline"
              >
                {addButtonText}
              </Button>
            </div>
            <div className="grid gap-2">
              {blocks.length > 0 ? (
                blocks.map((block, index) => {
                  const blockId = `${resolvedFieldId}-${index}`;

                  return (
                    <div
                      className="rounded-md border bg-background p-2"
                      key={blockId}
                    >
                      {renderBlock ? (
                        renderBlock({
                          disabled,
                          fieldId: blockId,
                          index,
                          onChange: (nextValue) =>
                            commitBlock(index, nextValue),
                          onRemove: () => removeBlock(index),
                          value: block,
                        })
                      ) : (
                        <div className="flex items-start gap-2">
                          <Textarea
                            className="min-h-20 resize-none"
                            disabled={disabled}
                            id={index === 0 ? resolvedFieldId : blockId}
                            onChange={(event) =>
                              commitBlock(index, event.target.value)
                            }
                            placeholder={placeholder}
                            value={block}
                          />
                          <Button
                            aria-label={`Remove block ${index + 1}`}
                            disabled={disabled}
                            onClick={() => removeBlock(index)}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                          >
                            <IconTrash />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  className={cn(
                    "rounded-md border border-dashed bg-muted/20 px-3 py-6 text-center text-muted-foreground text-xs",
                    disabled && "opacity-50"
                  )}
                >
                  No blocks added.
                </div>
              )}
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
