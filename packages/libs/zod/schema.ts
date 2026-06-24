import { z } from "zod";

export const nullToUndefined = (value: unknown) =>
  value === null ? undefined : value;

export const blankToUndefined = (value: unknown) => {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const blankToNull = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const createTextZSchema = (message = "Required.") =>
  z.string().trim().min(1, message);

export const createUpperTextZSchema = (message = "Required.") =>
  createTextZSchema(message).transform((value) => value.toUpperCase());

export const nullableTextZSchema = z.string().nullable();
export const nullableDateTimeZSchema = z.string().nullable();

export const optionalNullableTextZSchema = z
  .preprocess(blankToNull, createTextZSchema().nullable())
  .optional()
  .transform((value) => value ?? null);

export const optionalNullableEmailZSchema = z
  .preprocess(blankToNull, z.string().trim().email().nullable())
  .optional()
  .transform((value) => value ?? null);

export const createApiSuccessZSchema = <TSchema extends z.ZodTypeAny>(
  data: TSchema
) =>
  z.object({
    data,
    success: z.literal(true),
  });

export const pageZSchema = z.preprocess(
  nullToUndefined,
  z.coerce.number().int().min(1).default(1)
);

export const searchZSchema = z.preprocess(
  blankToUndefined,
  z.string().trim().min(1).optional()
);

export const offsetZSchema = z.preprocess(
  nullToUndefined,
  z.coerce.number().int().min(0).optional()
);

export const createLimitZSchema = (max = 100, initial = 10) =>
  z.preprocess(
    nullToUndefined,
    z.coerce.number().int().min(1).max(max).default(initial)
  );

export const createListStateZSchema = <TShape extends z.ZodRawShape>(
  shape: TShape
) =>
  z.object({
    limit: createLimitZSchema(),
    page: pageZSchema,
    search: searchZSchema,
    ...shape,
  });

export const createListQueryZSchema = <TShape extends z.ZodRawShape>(
  shape: TShape
) =>
  createListStateZSchema(shape)
    .extend({
      offset: offsetZSchema,
    })
    .transform((value) => {
      const pagination = value as typeof value & {
        limit: number;
        offset?: number;
        page: number;
      };

      return {
        ...value,
        offset: pagination.offset ?? (pagination.page - 1) * pagination.limit,
      };
    });

export const createListResultZSchema = <TSchema extends z.ZodTypeAny>(
  item: TSchema
) =>
  z.object({
    items: z.array(item),
    limit: z.number().int().min(1),
    offset: z.number().int().min(0),
    page: z.number().int().min(1),
    totalItems: z.number().int().min(0),
  });
