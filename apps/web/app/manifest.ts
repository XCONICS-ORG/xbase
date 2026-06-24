import { resolve } from "node:path";
import { WebMetadata } from "@xbase/constants/metadata/web";
import { createPwaManifest } from "@xbase/libs/pwa/manifest";
import { getPwaThemeColors } from "@xbase/libs/pwa/theme";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getPwaManifest = () =>
  createPwaManifest({
    appId: WebMetadata.appId,
    name: WebMetadata.title,
    shortName: WebMetadata.shortName,
    description: WebMetadata.description,
    iconBasePath: `/assets/icons/${WebMetadata.appId}`,
    ...getPwaThemeColors({
      cssPath: resolve(
        process.cwd(),
        "../../packages/design-system/styles/globals.css"
      ),
    }),
  });

export default async function manifest() {
  return await getPwaManifest()();
}
