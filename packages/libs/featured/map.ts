export type GoogleMapsLatLngLiteral = {
  lat: number;
  lng: number;
};

export type GoogleMapsProviderVariant = "basic" | "visgl";

export type GoogleMapsPublicConfig = {
  apiKey: string;
  callbackName: string;
  defaultCenter: GoogleMapsLatLngLiteral;
  libraries: readonly string[];
  mapId: string;
  providerVariant: GoogleMapsProviderVariant;
  regionCode: string;
  scriptId: string;
  version: string;
};

declare const process: {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
    NEXT_PUBLIC_GOOGLE_MAPS_ID?: string;
  };
};

export const GOOGLE_MAPS_DEFAULT_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
} satisfies GoogleMapsLatLngLiteral;

export const GOOGLE_MAPS_REGION_CODE = "in";
export const GOOGLE_MAPS_SCRIPT_ID = "xbase-google-maps-sdk";
export const GOOGLE_MAPS_CALLBACK_NAME = "__xbaseGoogleMapsResolve";
export const GOOGLE_MAPS_LIBRARIES = ["places", "marker"] as const;
export const GOOGLE_MAPS_PROVIDER_VARIANT =
  "basic" satisfies GoogleMapsProviderVariant;
export const GOOGLE_MAPS_VERSION = "weekly";

const publicGoogleMapsApiKey =
  typeof process === "undefined"
    ? ""
    : (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "");

const publicGoogleMapsId =
  typeof process === "undefined"
    ? ""
    : (process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID ?? "");

export const googleMapsPublicConfig = {
  apiKey: publicGoogleMapsApiKey,
  callbackName: GOOGLE_MAPS_CALLBACK_NAME,
  defaultCenter: GOOGLE_MAPS_DEFAULT_CENTER,
  libraries: GOOGLE_MAPS_LIBRARIES,
  mapId: publicGoogleMapsId,
  providerVariant: GOOGLE_MAPS_PROVIDER_VARIANT,
  regionCode: GOOGLE_MAPS_REGION_CODE,
  scriptId: GOOGLE_MAPS_SCRIPT_ID,
  version: GOOGLE_MAPS_VERSION,
} satisfies GoogleMapsPublicConfig;

export const createGoogleMapsScriptUrl = (
  config: GoogleMapsPublicConfig = googleMapsPublicConfig
) => {
  const searchParams = new URLSearchParams({
    callback: config.callbackName,
    key: config.apiKey,
    libraries: config.libraries.join(","),
    loading: "async",
    v: config.version,
  });

  if (config.mapId) {
    searchParams.set("map_ids", config.mapId);
  }

  return `https://maps.googleapis.com/maps/api/js?${searchParams.toString()}`;
};
