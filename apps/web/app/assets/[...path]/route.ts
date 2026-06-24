import { createPublicAssetRoute } from "@xbase/libs/assets/route";
import { resolve } from "node:path";

export const dynamic = "force-static";
export const runtime = "nodejs";

export const GET = createPublicAssetRoute({
  assetsRoot: resolve(process.cwd(), "../../packages/assets/public"),
});
