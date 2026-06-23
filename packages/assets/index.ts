export const assetDirectories = [
  "documents",
  "fonts",
  "icons",
  "images",
  "logos",
  "media",
] as const;

export type AssetDirectory = (typeof assetDirectories)[number];

export const assets = {
  directories: assetDirectories,
} as const;
