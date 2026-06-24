"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { FieldValues, Path } from "react-hook-form";

interface ZodLikeDef {
  innerType?: unknown;
  shape?: (() => unknown) | unknown;
  type?: string;
}

interface ZodLikeSchema {
  _def?: ZodLikeDef;
  _zod?: {
    def?: ZodLikeDef;
  };
  safeParse?: (value: unknown) => { success: boolean };
  shape?: (() => unknown) | unknown;
}

const FormRequiredFieldsContext = createContext<ReadonlySet<string> | null>(
  null
);

const getZodDef = (schema: unknown) => {
  const candidate = schema as ZodLikeSchema;

  if (candidate._zod?.def) {
    return candidate._zod.def;
  }

  return candidate._def;
};

const getZodShape = (schema: unknown) => {
  const candidate = schema as ZodLikeSchema;
  const directShape = "shape" in candidate ? candidate.shape : undefined;
  const shape = directShape ?? getZodDef(schema)?.shape;
  const resolvedShape = typeof shape === "function" ? shape() : shape;

  return resolvedShape && typeof resolvedShape === "object"
    ? (resolvedShape as Record<string, unknown>)
    : null;
};

const isOptionalSchema = (schema: unknown) => {
  const candidate = schema as ZodLikeSchema;

  if (
    !("safeParse" in candidate) ||
    typeof candidate.safeParse !== "function"
  ) {
    return false;
  }

  return candidate.safeParse(undefined).success;
};

const collectRequiredFieldNames = (
  schema: unknown,
  names: Set<string>,
  parentPath = ""
) => {
  const shape = getZodShape(schema);

  if (!shape) {
    return;
  }

  for (const [fieldName, fieldSchema] of Object.entries(shape)) {
    const path = parentPath ? `${parentPath}.${fieldName}` : fieldName;

    if (isOptionalSchema(fieldSchema)) {
      continue;
    }

    names.add(path);
    collectRequiredFieldNames(fieldSchema, names, path);
  }
};

export const getRequiredFieldNamesFromSchema = (schema: unknown) => {
  const names = new Set<string>();

  collectRequiredFieldNames(schema, names);

  return names;
};

export function FormRequiredFieldsProvider({
  children,
  requiredFields,
}: {
  children: ReactNode;
  requiredFields: ReadonlySet<string>;
}) {
  return (
    <FormRequiredFieldsContext.Provider value={requiredFields}>
      {children}
    </FormRequiredFieldsContext.Provider>
  );
}

export function useFormFieldRequired(
  name?: string,
  required?: boolean
): boolean {
  const requiredFields = useContext(FormRequiredFieldsContext);

  if (typeof required === "boolean") {
    return required;
  }

  return name ? (requiredFields?.has(name) ?? false) : false;
}

export function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5 text-destructive">
      *
    </span>
  );
}

export function FormFieldLabelText<TFormValues extends FieldValues>({
  children,
  name,
  required,
}: {
  children: ReactNode;
  name?: Path<TFormValues> | string;
  required?: boolean;
}) {
  const isRequired = useFormFieldRequired(
    name ? String(name) : undefined,
    required
  );

  return (
    <>
      {children}
      {isRequired ? <RequiredMark /> : null}
    </>
  );
}
