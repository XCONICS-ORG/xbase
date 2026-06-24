# @xbase/feature-flags

Shared feature flags for Xbase apps, built on the `flags` SDK.

This setup does not require Vercel or Vercel Toolbar. A flag is just a typed
server function whose `decide()` logic can read from `@xbase/env`, a database,
or any future admin panel.

## Add a flag

```ts
// packages/feature-flags/index.ts
import { env } from "@xbase/env";
import { createFlag } from "./lib/create-flag";

export const showBetaFeature = createFlag("showBetaFeature", {
  decide: () => env.FLAG_SHOW_BETA_FEATURE,
  description: "Shows the beta feature example banner.",
});
```

## Use a flag

```tsx
import { showBetaFeature } from "@xbase/feature-flags";

export default async function Page() {
  const enabled = await showBetaFeature();

  return enabled ? <div>Beta enabled</div> : null;
}
```

## Local env overrides

Flags can read from `@xbase/env` or from an env var generated from the flag key.

```env
# env/.env
FLAG_SHOW_BETA_FEATURE=true
```

## Test locally

1. Set the flag in `env/.env`:

```env
FLAG_SHOW_BETA_FEATURE=true
```

2. Start dev from the repo root:

```bash
bun run dev
```

3. Open the web app. The beta banner on the home page should appear.

4. Change it back to `false`, restart dev, and the banner should disappear.

The web app port also comes from `env/.env`:

```env
APP_WEB_PORT=3002
```

So the local URL is `http://localhost:3002`.

## Future provider

When you add an admin panel or database table, keep the app usage the same and
change only the `decide` function:

```ts
export const showBetaFeature = createFlag("showBetaFeature", {
  decide: async () => {
    return getFlagFromDatabase("showBetaFeature");
  },
});
```
