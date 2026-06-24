import { resolve } from "node:path";
import { WebMetadata } from "@xbase/constants/metadata/web";
import { createPwaManifest } from "@xbase/libs/pwa/manifest";
import { getPwaThemeColors } from "@xbase/libs/pwa/theme";

export const dynamic = "force-dynamic";

const pwaThemeColors = getPwaThemeColors({
  cssPath: resolve(process.cwd(), "../../packages/design-system/styles/globals.css"),
});

export default createPwaManifest({
  appId: WebMetadata.appId,
  name: WebMetadata.title,
  shortName: WebMetadata.shortName,
  description: WebMetadata.description,
  ...pwaThemeColors,
});
