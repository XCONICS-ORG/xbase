import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { extname, join } from "node:path";
import type { PwaIconRouteConfig } from "./types";

const nodeRequire = createRequire(import.meta.url);
const APP_SEGMENT_RE = /^[a-z0-9][a-z0-9-]*$/i;
const PWA_ICON_FILE_RE = /^pwa(?:-w)?-(?:180|192|512)\.png$/i;

const contentTypes: Record<string, string> = {
  ".png": "image/png",
};

export interface PwaIconRouteContext {
  params:
    | {
        app?: string;
        file?: string;
      }
    | Promise<{
        app?: string;
        file?: string;
      }>;
}

const notFound = () => new Response("Not found", { status: 404 });

export function createPwaIconRoute({
  assetPackageName = "@xbase/assets",
  assetsRoot,
  cacheControl = "public, max-age=31536000, immutable",
}: PwaIconRouteConfig = {}) {
  return async function GET(_request: Request, context: PwaIconRouteContext) {
    const params = await context.params;
    const app = params.app ?? "";
    const file = params.file ?? "";

    if (!(APP_SEGMENT_RE.test(app) && PWA_ICON_FILE_RE.test(file))) {
      return notFound();
    }

    try {
      const assetPath = assetsRoot
        ? join(assetsRoot, app, file)
        : nodeRequire.resolve(`${assetPackageName}/icons/${app}/${file}`);
      const body = await readFile(assetPath);
      const contentType =
        contentTypes[extname(file)] ?? "application/octet-stream";

      return new Response(body, {
        headers: {
          "Cache-Control": cacheControl,
          "Content-Type": contentType,
        },
      });
    } catch {
      return notFound();
    }
  };
}
