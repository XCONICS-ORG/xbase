import { WebMetadata } from "@xbase/constants/metadata/web";
import { createPwaServiceWorkerRoute } from "@xbase/libs/pwa/service-worker";

export const dynamic = "force-static";

export const GET = createPwaServiceWorkerRoute({
  appId: WebMetadata.appId,
  defaultNotificationIcon: `/assets/icons/${WebMetadata.appId}/pwa-192.png`,
  defaultNotificationTitle: WebMetadata.title,
  version: `${WebMetadata.appId}-pwa-v1`,
});
