import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { defaultPwaIconSizes, type PwaManifestConfig } from "./types";

export const APPLE_PLATFORM_RE = /\b(mac|iphone|ipad|ipod|ios)\b/i;
const TRAILING_SLASH_RE = /\/+$/;

const normalizePublicPath = (path: string) => {
  const normalized = path.replace(TRAILING_SLASH_RE, "");

  if (!normalized) {
    return "";
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export const getPwaIconPrefix = async () => {
  const requestHeaders = await headers();
  const platform = requestHeaders.get("sec-ch-ua-platform") ?? "";
  const userAgent = requestHeaders.get("user-agent") ?? "";
  const platformHint = `${platform} ${userAgent}`;

  return APPLE_PLATFORM_RE.test(platformHint) ? "pwa" : "pwa-w";
};

export function createPwaManifest(config: PwaManifestConfig) {
  return async function manifest(): Promise<
    MetadataRoute.Manifest & { gcm_sender_id?: string }
  > {
    const iconPrefix = await getPwaIconPrefix();
    const iconBasePath = normalizePublicPath(
      config.iconBasePath ?? `/icons/${config.appId ?? "web"}`
    );
    const iconSizes = config.iconSizes ?? defaultPwaIconSizes;
    const startUrl = config.startUrl ?? "/";
    const scope = config.scope ?? "/";

    return {
      id: config.id ?? startUrl,
      name: config.name,
      short_name: config.shortName,
      description: config.description,
      start_url: startUrl,
      scope,
      display: config.display ?? "standalone",
      background_color: config.backgroundColor ?? "#ffffff",
      theme_color: config.themeColor ?? "#000000",
      orientation: config.orientation ?? "any",
      icons: iconSizes.map((size) => ({
        src: `${iconBasePath}/${iconPrefix}-${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png",
        purpose: config.iconPurpose ?? "any",
      })),
      ...(config.gcmSenderId ? { gcm_sender_id: config.gcmSenderId } : {}),
    };
  };
}
