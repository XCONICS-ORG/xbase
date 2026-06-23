# @turtle/env

Single typed env source for Turtle apps and packages.

All shared values live in `env/.env`. Import `env` anywhere server-side:

```ts
import { env } from "@turtle/env";

if (env.FLAG_SHOW_BETA_FEATURE) {
  // ...
}
```

Next apps should call `loadGlobalEnv()` in `next.config.ts` before reading env:

```ts
import { loadGlobalEnv } from "@turtle/env/load";

loadGlobalEnv();
```

Add new variables in `packages/env/index.ts` and document them in
`env/.env.example`.

Current shared values:

```env
APP_ENV=development
APP_WEB_PORT=3002
FLAG_SHOW_BETA_FEATURE=false
PRODUCTION_URL=
```
