export type AccessRequirement =
  | string
  | readonly string[]
  | Record<string, unknown>;

export type AccessPredicate<TAccess = AccessRequirement> = (
  access: TAccess | undefined
) => boolean;
