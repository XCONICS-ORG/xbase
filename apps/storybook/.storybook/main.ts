import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";
import { loadGlobalEnv } from "@xbase/env/load";

const require = createRequire(import.meta.url);

const getAbsolutePath = (value: string) =>
  dirname(require.resolve(join(value, "package.json")));

loadGlobalEnv();

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-themes"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
    options: {},
  },
  env: (currentEnv) => ({
    ...currentEnv,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    NEXT_PUBLIC_GOOGLE_MAPS_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? "",
  }),
  staticDirs: ["../public"],
};

export default config;
