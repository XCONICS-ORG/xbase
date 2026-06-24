# Xbase

**A Bun and Turborepo workspace for Next.js apps, shared UI, uploads, and utilities.**

<div>
  <img src="https://img.shields.io/github/license/XCONICS-ORG/xbase" alt="" />
</div>

## Overview

[Xbase](https://github.com/XCONICS-ORG/xbase) is a production-ready monorepo foundation for building Next.js products with shared packages and consistent tooling. It uses [Bun](https://bun.sh), [Turborepo](https://turborepo.com), [Next.js](https://nextjs.org), Storybook, shadcn/ui-style components, typed environment validation, and S3-compatible bucket storage.

Xbase is intentionally package-first. Apps import shared behavior from `@xbase/*` workspace packages instead of duplicating app-local helpers.

## Principles

- **Fast**: Bun, Turbo, focused package boundaries, and fast local app selection.
- **Typed**: Shared TypeScript config and typed environment variables through `@xbase/env`.
- **Reusable**: UI, uploads, SEO, icons, assets, feature flags, and utilities live in packages.
- **Deployable anywhere**: Built for Docker/VPS deployments, not tied to Vercel.

## Apps

Xbase currently has two runtime apps:

- **Web**: `apps/web`, the main Next.js application.
- **Storybook**: `apps/storybook`, the component and module workshop.

## Packages

Xbase includes these shared packages:

- `@xbase/assets`: shared static assets and logos.
- `@xbase/bucket`: Better Upload and S3-compatible storage helpers.
- `@xbase/design-system`: UI components, modules, providers, hooks, and styles.
- `@xbase/env`: root env loading and validation from `env/.env`.
- `@xbase/feature-flags`: typed feature flag helpers.
- `@xbase/icons`: shared icon entry points.
- `@xbase/internationalization`: locale config, dictionaries, navigation, and proxy helpers.
- `@xbase/libs`: small shared integrations such as Nuqs helpers.
- `@xbase/seo`: metadata and JSON-LD helpers.
- `@xbase/typescript-config`: shared TypeScript config presets.
- `@xbase/utility`: formatters, functions, QR code, barcode, and avatar generators.

## Getting Started

### Prerequisites

- Node.js `>=20`
- Bun `1.3.14`
- A root `env/.env` file for local overrides when needed

### Install

```bash
bun install
```

### Environment

Copy the shared env example:

```bash
cp env/.env.example env/.env
```

All shared server-side env values are loaded from the root `env/` folder and validated by `@xbase/env`.

Use env from apps and packages like this:

```ts
import { env } from "@xbase/env";
```

### Run Apps

Use the interactive runner:

```bash
bun run dev
```

Run selected apps:

```bash
bun run dev -- --app web
bun run dev -- --app storybook
```

Run everything with a dev script:

```bash
bun run dev -- --all
```

Default local ports:

| Surface | Env | Default |
| --- | --- | --- |
| Web | `APP_WEB_PORT` | `3002` |
| Storybook | `STORYBOOK_PORT` | `5002` |

## Structure

```txt
xbase/
  apps/
    web/
    storybook/
  env/
    .env.example
  packages/
    assets/
    bucket/
    design-system/
    env/
    feature-flags/
    icons/
    internationalization/
    libs/
    seo/
    typescript-config/
    utility/
  scripts/
    bucket/
    project/
    storybook/
    theme/
```

## Docker/VPS Deployment

Xbase is not tied to Vercel. Build apps with Turbo, then run them behind your own reverse proxy on a VPS.

Typical deployment surfaces:

- `web`: `apps/web`
- `storybook`: static output from `apps/storybook`

Set production env values in your VPS/container environment, especially `PRODUCTION_URL` and bucket credentials.

## Source

Repository: [XCONICS-ORG/xbase](https://github.com/XCONICS-ORG/xbase)

## License

Add a license file if this repository is intended to be open source.
