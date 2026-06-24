import { WebMetadata } from "@xbase/constants/metadata/web";
import { createPwaServiceWorkerRoute } from "@xbase/libs/pwa/service-worker";

export const dynamic = "force-static";

export const GET = createPwaServiceWorkerRoute({
  appId: WebMetadata.appId,
  defaultNotificationTitle: WebMetadata.title,
  version: `${WebMetadata.appId}-pwa-v1`,
});
