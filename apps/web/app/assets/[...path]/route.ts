import { resolve } from "node:path";
import { createPublicAssetRoute } from "@xbase/libs/assets/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

export const GET = createPublicAssetRoute({
  assetsRoot: resolve(process.cwd(), "../../packages/assets/public"),
});
