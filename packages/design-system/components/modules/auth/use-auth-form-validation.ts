"use client";

import { useCallback, useState } from "react";
import type { z } from "zod";
import type { AuthFormData } from "./auth-block";

export type AuthValidationField = keyof AuthFormData | "code";
export type AuthFieldErrors = Partial<Record<AuthValidationField, string>>;

export function useAuthFormValidation() {
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});

  const clearFieldError = useCallback((field: AuthValidationField) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }
      return { ...current, [field]: undefined };
    });
  }, []);

  const clearFieldErrors = useCallback(() => setFieldErrors({}), []);

  const validate = useCallback(
    (schema: z.ZodType, values: Record<string, string>): boolean => {
      const result = schema.safeParse(values);
      if (result.success) {
        setFieldErrors({});
        return true;
      }

      const errors: AuthFieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in errors)) {
          errors[field as AuthValidationField] = issue.message;
        }
      }
      setFieldErrors(errors);
      return false;
    },
    []
  );

  return { clearFieldError, clearFieldErrors, fieldErrors, validate };
}
