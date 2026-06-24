/** biome-ignore-all lint/suspicious/useAwait: React Hook Form resolver API supports async resolvers. */
import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod/v4";

export const createZodResolver =
  <TValues extends FieldValues>(
    schema: z.ZodObject<z.ZodRawShape>
  ): Resolver<TValues> =>
  async (values) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return {
        errors: {},
        values: parsed.data as TValues,
      };
    }

    const errors: FieldErrors<TValues> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];

      if (typeof field !== "string") {
        continue;
      }

      const key = field as keyof TValues;

      if (errors[key]) {
        continue;
      }

      errors[key] = {
        message: issue.message,
        type: "zod",
      } as FieldErrors<TValues>[typeof key];
    }

    return {
      errors,
      values: {} as Record<string, never>,
    };
  };
