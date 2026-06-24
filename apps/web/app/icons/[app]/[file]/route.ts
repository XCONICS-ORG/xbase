import { resolve } from "node:path";
import { createPwaIconRoute } from "@xbase/libs/pwa/assets";

export const dynamic = "force-static";
export const runtime = "nodejs";

export const GET = createPwaIconRoute({
  assetsRoot: resolve(process.cwd(), "../../packages/assets/public/icons"),
});
