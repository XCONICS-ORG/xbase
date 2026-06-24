import type { PwaServiceWorkerConfig } from "./types";

const toJson = (value: unknown) => JSON.stringify(value);

export function createPwaServiceWorkerSource(config: PwaServiceWorkerConfig) {
  const cachePrefix = config.cachePrefix ?? `${config.appId}-pwa`;
  const version = config.version ?? `${cachePrefix}-v1`;
  const workerConfig = {
    cachePrefix,
    defaultActionUrl: config.defaultActionUrl ?? "/",
    defaultNotificationIcon:
      config.defaultNotificationIcon ??
      `/assets/icons/${config.appId}/pwa-192.png`,
    defaultNotificationTitle: config.defaultNotificationTitle ?? config.appId,
    messageType: config.messageType ?? `${config.appId}-push-notification`,
    notificationTag: config.notificationTag ?? `${config.appId}-notification`,
    version,
  };

  return `const PWA_CONFIG = Object.freeze(${toJson(workerConfig)});

function pickFirst(...values) {
  return values.find((value) => typeof value === "string" && value.trim().length > 0);
}

function toSameOriginUrl(value, fallback = PWA_CONFIG.defaultActionUrl) {
  const source = pickFirst(value, fallback) || fallback;

  try {
    return new URL(source, self.location.origin).href;
  } catch {
    return new URL(fallback, self.location.origin).href;
  }
}

function toNotificationAssetUrl(value) {
  const source = pickFirst(value);

  if (!source) {
    return;
  }

  try {
    return new URL(source, self.location.origin).href;
  } catch {
    return source;
  }
}

function parsePushPayload(event) {
  if (!event.data) {
    return {};
  }

  try {
    return event.data.json();
  } catch {
    try {
      return JSON.parse(event.data.text());
    } catch {
      return {};
    }
  }
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(
            cacheNames
              .filter(
                (cacheName) =>
                  cacheName.startsWith(PWA_CONFIG.cachePrefix) &&
                  cacheName !== PWA_CONFIG.version
              )
              .map((cacheName) => caches.delete(cacheName))
          )
        ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (
    event.request.method !== "GET" ||
    requestUrl.origin !== self.location.origin ||
    requestUrl.pathname.startsWith("/api/")
  ) {
    return;
  }

  event.respondWith(fetch(event.request));
});

self.addEventListener("push", (event) => {
  const payload = parsePushPayload(event);
  const notification = payload.notification ?? payload.webpush?.notification ?? {};
  const data = payload.data ?? {};
  const fcmOptions =
    payload.fcmOptions ??
    payload.fcm_options ??
    payload.webpush?.fcmOptions ??
    payload.webpush?.fcm_options ??
    {};
  const title = pickFirst(
    notification.title,
    data.title,
    PWA_CONFIG.defaultNotificationTitle
  );
  const icon = toNotificationAssetUrl(
    pickFirst(notification.icon, data.icon, PWA_CONFIG.defaultNotificationIcon)
  );
  const badge = toNotificationAssetUrl(
    pickFirst(notification.badge, data.badge, PWA_CONFIG.defaultNotificationIcon)
  );
  const image = toNotificationAssetUrl(pickFirst(notification.image, data.image));
  const actionUrl = toSameOriginUrl(
    pickFirst(fcmOptions.link, data.actionUrl, data.link, data.click_action)
  );
  const options = {
    body: pickFirst(notification.body, data.body, ""),
    icon,
    badge,
    image,
    tag: pickFirst(notification.tag, data.tag, PWA_CONFIG.notificationTag),
    renotify: true,
    timestamp: Date.now(),
    actions: Array.isArray(notification.actions) ? notification.actions : undefined,
    data: {
      actionUrl,
      ...data,
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      self.clients
        .matchAll({
          includeUncontrolled: true,
          type: "window",
        })
        .then((clients) => {
          for (const client of clients) {
            client.postMessage({
              type: PWA_CONFIG.messageType,
              notification: {
                title,
                body: options.body,
                icon,
                image,
                actionUrl,
              },
            });
          }
        }),
    ])
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.actionUrl || PWA_CONFIG.defaultActionUrl,
    self.location.origin
  );

  event.waitUntil(
    self.clients
      .matchAll({
        includeUncontrolled: true,
        type: "window",
      })
      .then((clients) => {
        const matchingClient = clients.find((client) => {
          try {
            return new URL(client.url).origin === targetUrl.origin;
          } catch {
            return false;
          }
        });

        if (matchingClient) {
          matchingClient.focus();
          return matchingClient.navigate(targetUrl.href);
        }

        return self.clients.openWindow(targetUrl.href);
      })
  );
});
`;
}

export function createPwaServiceWorkerRoute(config: PwaServiceWorkerConfig) {
  const source = createPwaServiceWorkerSource(config);

  return function GET() {
    return new Response(source, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/javascript; charset=utf-8",
        "Service-Worker-Allowed": "/",
      },
    });
  };
}
