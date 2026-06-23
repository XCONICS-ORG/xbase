# xco-turtle

This is a Next.js monorepo template with shadcn/ui.

## Environment

Shared environment variables live in `env/.env` and are typed by
`@turtle/env`.

Use them from any server-side app or package:

```ts
import { env } from "@turtle/env";
```

Add new variables in `packages/env/index.ts` and document them in
`env/.env.example`.

The web app port is controlled by:

```env
APP_WEB_PORT=3002
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
bunx shadcn@latest add button -c apps/web
```

This will place the UI components in the `packages/design-system/components/ui` directory.

## Theme fallback

Before trying a tweakcn theme, save the current design-system CSS:

```bash
bun run theme:backup "before blue tweakcn"
```

To try the configured tweakcn theme with backup first:

```bash
bun run theme:tweakcn
```

If you accidentally accept the overwrite and want the original theme back:

```bash
bun run theme:restore
```

That opens an interactive selector. To list saved backups:

```bash
bun run theme:list
```

To restore the newest named backup:

```bash
bun run theme:restore:latest
```

To restore the built-in default:

```bash
bun run theme:restore:default
```

To restore a specific backup directly:

```bash
bun run theme:restore 2026-06-22_16-30-00-before-blue-tweakcn.css
```

## Using components

To use the components in your app, import them from the `design-system` package.

```tsx
import { Button } from "@turtle/design-system/components/ui/button";
```
