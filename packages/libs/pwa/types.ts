import type { ReactNode } from "react";

export const defaultPwaIconSizes = [180, 192, 512] as const;

export type PwaIconSize = (typeof defaultPwaIconSizes)[number];

export type PwaDisplayMode =
  | "browser"
  | "fullscreen"
  | "minimal-ui"
  | "standalone";

export type PwaOrientation =
  | "any"
  | "landscape"
  | "landscape-primary"
  | "landscape-secondary"
  | "natural"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary";

export interface PwaManifestConfig {
  appId?: string;
  backgroundColor?: string;
  description: string;
  display?: PwaDisplayMode;
  gcmSenderId?: string;
  iconBasePath?: string;
  iconPurpose?: "any" | "maskable" | "monochrome";
  iconSizes?: readonly number[];
  id?: string;
  name: string;
  orientation?: PwaOrientation;
  scope?: string;
  shortName: string;
  startUrl?: string;
  themeColor?: string;
}

export interface PwaProviderProps {
  children: ReactNode;
  registerServiceWorker?: boolean;
  scope?: string;
  serviceWorkerPath?: string;
  updateViaCache?: ServiceWorkerRegistration["updateViaCache"];
}

export type PwaInstallOutcome = "accepted" | "dismissed";

export interface PwaContextValue {
  canInstall: boolean;
  promptForInstall: () => Promise<PwaInstallOutcome | null>;
}

export interface PwaServiceWorkerConfig {
  appId: string;
  cachePrefix?: string;
  defaultActionUrl?: string;
  defaultNotificationIcon?: string;
  defaultNotificationTitle?: string;
  messageType?: string;
  notificationTag?: string;
  version?: string;
}

export interface PwaIconRouteConfig {
  assetPackageName?: string;
  assetsRoot?: string;
  cacheControl?: string;
}
