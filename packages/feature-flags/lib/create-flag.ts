import { loadGlobalEnv } from "@xbase/env/load";
import { flag } from "flags/next";

loadGlobalEnv();

type MaybePromise<T> = T | Promise<T>;

export interface CreateFlagOptions {
  decide?: () => MaybePromise<boolean | null | undefined>;
  defaultValue?: boolean;
  description?: string;
  envKey?: string;
  origin?: string;
}

const toEnvKey = (key: string) =>
  `FLAG_${key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase()}`;

const parseBoolean = (value: string | undefined) => {
  if (!value) {
    return;
  }

  if (["1", "true", "yes", "on"].includes(value.toLowerCase())) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(value.toLowerCase())) {
    return false;
  }
};

export const createFlag = (key: string, options: CreateFlagOptions = {}) => {
  const defaultValue = options.defaultValue ?? false;

  return flag({
    key,
    defaultValue,
    description: options.description,
    origin: options.origin ?? "xbase",
    options: [
      { label: "Enabled", value: true },
      { label: "Disabled", value: false },
    ],
    async decide() {
      const customValue = await options.decide?.();

      if (typeof customValue === "boolean") {
        return customValue;
      }

      return (
        parseBoolean(process.env[options.envKey ?? toEnvKey(key)]) ??
        defaultValue
      );
    },
  });
};
