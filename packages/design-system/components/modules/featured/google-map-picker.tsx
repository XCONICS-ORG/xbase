/// <reference types="google.maps" />

"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  type MapCameraChangedEvent,
  type MapMouseEvent,
  useApiIsLoaded,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Button } from "@xbase/design-system/components/ui/button";
import { Field, FieldLabel } from "@xbase/design-system/components/ui/field";
import { Input } from "@xbase/design-system/components/ui/input";
import { cn } from "@xbase/design-system/lib/utils";
import {
  IconCurrentLocation,
  IconFocusCentered,
  IconLoader2,
  IconMap,
  IconMap2,
  IconMapPin,
  IconSearch,
  IconZoomIn,
  IconZoomOut,
} from "@xbase/icons/tabler";
import {
  createGoogleMapsScriptUrl,
  googleMapsPublicConfig,
  type GoogleMapsLatLngLiteral,
  type GoogleMapsProviderVariant,
} from "@xbase/libs/featured/map";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export type GoogleMapPickerValue = {
  address?: string | null;
  latitude: number;
  longitude: number;
};

export type GoogleMapPickerProps = {
  address?: string | null;
  className?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  onChange: (value: GoogleMapPickerValue) => void;
  variant?: GoogleMapsProviderVariant;
};

type GooglePlacePrediction = {
  description: string;
  id: string;
  mainText: string;
  placePrediction: google.maps.places.PlacePrediction;
  secondaryText?: string;
};

type GoogleMapPickerLayoutProps = {
  children: ReactNode;
  className?: string;
  isLoading: boolean;
  isLocating: boolean;
  isPredictionLoading: boolean;
  isReady: boolean;
  isSearchInteracting: boolean;
  loadError: string | null;
  onLocate: () => void;
  onPredictionSelect: (prediction: GooglePlacePrediction) => void;
  onSearch: () => void;
  predictions: GooglePlacePrediction[];
  searchValue: string;
  selectedPosition: GoogleMapsLatLngLiteral | null;
  setIsSearchInteracting: (value: boolean) => void;
  setSearchValue: (value: string) => void;
  setShowPredictions: (value: boolean) => void;
  showPredictions: boolean;
};

type BasicGoogleMapsWindow = Window & {
  google?: typeof google;
  __xbaseGoogleMapsPromise?: Promise<typeof google>;
  __xbaseGoogleMapsResolve?: () => void;
};

type VisglMapTypeId = "roadmap" | "satellite";

const MAP_CONTAINER_CLASS_NAME = "relative overflow-hidden border bg-muted/20";
const MAP_VIEW_CLASS_NAME = "h-80 w-full";
const VISGL_MIN_ZOOM = 3;
const VISGL_MAX_ZOOM = 20;

const toNumber = (value?: number | string | null) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const toLatLngLiteral = (
  position?: google.maps.LatLng | google.maps.LatLngLiteral | null
): GoogleMapsLatLngLiteral | null => {
  if (!position) {
    return null;
  }

  if (
    typeof position.lat === "function" &&
    typeof position.lng === "function"
  ) {
    return { lat: position.lat(), lng: position.lng() };
  }

  const literal = position as google.maps.LatLngLiteral;
  return { lat: literal.lat, lng: literal.lng };
};

const toInitialPosition = (
  latitude?: number | string | null,
  longitude?: number | string | null
) => {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);

  return lat !== null && lng !== null ? { lat, lng } : null;
};

const formatCoordinate = (value: number) => value.toFixed(6);

const getBrowserCurrentPosition = () =>
  new Promise<GoogleMapsLatLngLiteral>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser geolocation is unavailable."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      reject,
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      }
    );
  });

const getGoogleApproximatePosition = async () => {
  if (!googleMapsPublicConfig.apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleMapsPublicConfig.apiKey}`,
      {
        body: JSON.stringify({ considerIp: true }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    );

    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as {
      location?: { lat?: number; lng?: number };
    };
    const lat = result.location?.lat;
    const lng = result.location?.lng;

    return typeof lat === "number" && typeof lng === "number"
      ? { lat, lng }
      : null;
  } catch {
    return null;
  }
};

const resolveCurrentPosition = async (fallback: GoogleMapsLatLngLiteral) => {
  try {
    return await getBrowserCurrentPosition();
  } catch {
    return (await getGoogleApproximatePosition()) ?? fallback;
  }
};

const loadBasicGoogleMaps = () => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps is only available in the browser.")
    );
  }

  const mapsWindow = window as BasicGoogleMapsWindow;

  if (mapsWindow.google?.maps) {
    return Promise.resolve(mapsWindow.google);
  }

  if (mapsWindow.__xbaseGoogleMapsPromise) {
    return mapsWindow.__xbaseGoogleMapsPromise;
  }

  if (!googleMapsPublicConfig.apiKey) {
    return Promise.reject(new Error("Google Maps API key is missing."));
  }

  mapsWindow.__xbaseGoogleMapsPromise = new Promise((resolve, reject) => {
    mapsWindow.__xbaseGoogleMapsResolve = () => {
      if (mapsWindow.google?.maps) {
        resolve(mapsWindow.google);
        return;
      }

      reject(new Error("Google Maps SDK loaded without a maps namespace."));
    };

    const existingScript = document.getElementById(
      googleMapsPublicConfig.scriptId
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("error", () =>
        reject(new Error("Google Maps failed."))
      );
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.id = googleMapsPublicConfig.scriptId;
    script.onerror = () => reject(new Error("Google Maps failed to load."));
    script.src = createGoogleMapsScriptUrl();
    document.head.appendChild(script);
  });

  return mapsWindow.__xbaseGoogleMapsPromise;
};

function GoogleMapPickerUnavailable({
  address,
  className,
  latitude,
  longitude,
}: Omit<GoogleMapPickerProps, "onChange">) {
  const selectedPosition = toInitialPosition(latitude, longitude);

  return (
    <GoogleMapPickerLayout
      className={className}
      isLoading={false}
      isLocating={false}
      isPredictionLoading={false}
      isReady={false}
      isSearchInteracting={false}
      loadError="Google Maps API key is missing."
      onLocate={() => undefined}
      onPredictionSelect={() => undefined}
      onSearch={() => undefined}
      predictions={[]}
      searchValue={address ?? ""}
      selectedPosition={selectedPosition}
      setIsSearchInteracting={() => undefined}
      setSearchValue={() => undefined}
      setShowPredictions={() => undefined}
      showPredictions={false}
    >
      <div className={MAP_VIEW_CLASS_NAME} />
    </GoogleMapPickerLayout>
  );
}

function GoogleMapPickerLayout({
  children,
  className,
  isLoading,
  isLocating,
  isPredictionLoading,
  isReady,
  isSearchInteracting,
  loadError,
  onLocate,
  onPredictionSelect,
  onSearch,
  predictions,
  searchValue,
  selectedPosition,
  setIsSearchInteracting,
  setSearchValue,
  setShowPredictions,
  showPredictions,
}: GoogleMapPickerLayoutProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <Field className="relative">
          <FieldLabel htmlFor="map-search">
            Search address or coordinates
          </FieldLabel>
          <Input
            autoComplete="off"
            className="pr-9"
            disabled={Boolean(loadError)}
            id="map-search"
            onBlur={() => {
              window.setTimeout(() => setShowPredictions(false), 150);
            }}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setIsSearchInteracting(true);
              setShowPredictions(true);
            }}
            onFocus={() => {
              if (isSearchInteracting && predictions.length > 0) {
                setShowPredictions(true);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (predictions[0]) {
                  onPredictionSelect(predictions[0]);
                  return;
                }
                onSearch();
              }
            }}
            placeholder="Address or 22.5909, 88.4404"
            value={searchValue}
          />
          {isPredictionLoading ? (
            <IconLoader2 className="absolute right-3 bottom-2.5 size-4 animate-spin text-muted-foreground" />
          ) : null}
          {showPredictions && predictions.length > 0 ? (
            <div className="absolute top-[calc(100%+4px)] right-0 left-0 z-30 max-h-72 overflow-y-auto border bg-popover shadow-md">
              {predictions.map((prediction) => (
                <button
                  className="flex w-full items-start gap-3 border-b px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-muted"
                  key={prediction.id}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onPredictionSelect(prediction);
                  }}
                  type="button"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center border bg-background text-muted-foreground">
                    <IconMapPin className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-sm">
                      {prediction.mainText}
                    </span>
                    {prediction.secondaryText ? (
                      <span className="block truncate text-muted-foreground text-xs">
                        {prediction.secondaryText}
                      </span>
                    ) : null}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </Field>
        <Button
          className="self-end"
          disabled={isLoading || Boolean(loadError) || !isReady}
          leftIcon={<IconSearch className="size-4" />}
          onClick={onSearch}
          type="button"
          variant="outline"
        >
          Search
        </Button>
        <Button
          className="self-end"
          disabled={isLoading || Boolean(loadError) || isLocating}
          leftIcon={
            isLocating ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconCurrentLocation className="size-4" />
            )
          }
          onClick={onLocate}
          type="button"
        >
          Locate
        </Button>
      </div>
      <div className={MAP_CONTAINER_CLASS_NAME}>
        {children}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/80 text-muted-foreground text-sm">
            <IconLoader2 className="size-4 animate-spin" />
            Loading map
          </div>
        ) : null}
        {loadError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-4 text-center text-destructive text-sm">
            {loadError}
          </div>
        ) : null}
      </div>
      <p className="flex items-center gap-2 text-muted-foreground text-xs">
        <IconMapPin className="size-3.5" />
        {selectedPosition
          ? `${selectedPosition.lat}, ${selectedPosition.lng}`
          : "No coordinates selected"}
      </p>
    </div>
  );
}

export function GoogleMapPicker({
  variant = googleMapsPublicConfig.providerVariant,
  ...props
}: GoogleMapPickerProps) {
  if (!googleMapsPublicConfig.apiKey) {
    return <GoogleMapPickerUnavailable {...props} />;
  }

  if (variant === "visgl") {
    return <GoogleMapPickerVisgl {...props} />;
  }

  return <GoogleMapPickerBasic {...props} />;
}

function GoogleMapPickerBasic({
  address,
  className,
  latitude,
  longitude,
  onChange,
}: Omit<GoogleMapPickerProps, "variant">) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const placesLibraryRef = useRef<google.maps.PlacesLibrary | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const onChangeRef = useRef(onChange);
  const searchValueRef = useRef(address ?? "");
  const initialSelectedPosition = useMemo(
    () => toInitialPosition(latitude, longitude),
    [latitude, longitude]
  );
  const initialPosition = useMemo(
    () => initialSelectedPosition ?? googleMapsPublicConfig.defaultCenter,
    [initialSelectedPosition]
  );
  const [searchValue, setSearchValueState] = useState(address ?? "");
  const [selectedPosition, setSelectedPosition] =
    useState<GoogleMapsLatLngLiteral | null>(initialSelectedPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isSearchInteracting, setIsSearchInteracting] = useState(false);

  const setSearchValue = (value: string) => {
    setSearchValueState(value);
    searchValueRef.current = value;
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (address !== undefined) {
      setSearchValue(address ?? "");
      setPredictions([]);
      setShowPredictions(false);
      setIsSearchInteracting(false);
    }
  }, [address]);

  const applyPickerPosition = (
    position: GoogleMapsLatLngLiteral,
    nextAddress?: string | null
  ) => {
    if (!(mapRef.current && markerRef.current)) {
      return;
    }

    markerRef.current.position = position;
    mapRef.current.panTo(position);
    mapRef.current.setZoom(16);
    setSelectedPosition(position);

    if (nextAddress !== undefined) {
      setSearchValue(nextAddress ?? "");
    }

    onChangeRef.current({
      address: nextAddress ?? (searchValueRef.current.trim() || null),
      latitude: position.lat,
      longitude: position.lng,
    });
    setPredictions([]);
    setShowPredictions(false);
    setIsSearchInteracting(false);
  };

  const reverseGeocodePosition = (
    position: GoogleMapsLatLngLiteral,
    preferredAddress?: string | null
  ) => {
    const geocoder = geocoderRef.current;

    if (!geocoder) {
      applyPickerPosition(position, preferredAddress);
      return;
    }

    geocoder.geocode({ location: position }, (results) => {
      applyPickerPosition(
        position,
        preferredAddress ?? results?.[0]?.formatted_address ?? null
      );
    });
  };

  useEffect(() => {
    let mounted = true;

    loadBasicGoogleMaps()
      .then(async (mapsApi) => {
        if (!(mounted && mapElementRef.current)) {
          return;
        }

        const markerLibrary =
          (await mapsApi.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
        const placesLibrary =
          (await mapsApi.maps.importLibrary("places")) as google.maps.PlacesLibrary;
        const map = new mapsApi.maps.Map(mapElementRef.current, {
          center: initialPosition,
          clickableIcons: true,
          disableDefaultUI: true,
          fullscreenControl: true,
          gestureHandling: "greedy",
          mapId: googleMapsPublicConfig.mapId,
          mapTypeControl: true,
          streetViewControl: true,
          zoom: initialSelectedPosition ? 16 : 5,
          zoomControl: true,
        });
        const marker = new markerLibrary.AdvancedMarkerElement({
          gmpDraggable: true,
          map,
          position: initialPosition,
          title: "Selected map location",
        });
        const geocoder = new mapsApi.maps.Geocoder();

        listenersRef.current = [
          map.addListener("click", (event: google.maps.MapMouseEvent) => {
            const position = toLatLngLiteral(event.latLng);

            if (position) {
              reverseGeocodePosition(position);
            }
          }),
          marker.addListener("dragend", () => {
            const position = toLatLngLiteral(marker.position);

            if (position) {
              reverseGeocodePosition(position);
            }
          }),
        ];

        mapRef.current = map;
        markerRef.current = marker;
        geocoderRef.current = geocoder;
        placesLibraryRef.current = placesLibrary;
        sessionTokenRef.current = new placesLibrary.AutocompleteSessionToken();
        setLoadError(null);
        setIsReady(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load Google Maps."
        );
        setIsLoading(false);
      });

    return () => {
      mounted = false;
      for (const listener of listenersRef.current) {
        listener.remove();
      }
      listenersRef.current = [];

      if (markerRef.current) {
        markerRef.current.map = null;
      }

      setIsReady(false);
    };
  }, [initialPosition, initialSelectedPosition]);

  useEffect(() => {
    const trimmedSearch = searchValue.trim();
    const placesLibrary = placesLibraryRef.current;
    let isActive = true;

    if (
      !(
        isReady &&
        isSearchInteracting &&
        placesLibrary &&
        trimmedSearch.length >= 2
      )
    ) {
      setPredictions([]);
      setIsPredictionLoading(false);
      return;
    }

    setIsPredictionLoading(true);
    const timeout = window.setTimeout(async () => {
      try {
        const { suggestions } =
          await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            includedRegionCodes: [googleMapsPublicConfig.regionCode],
            input: trimmedSearch,
            locationBias: selectedPosition
              ? {
                  center: selectedPosition,
                  radius: 50_000,
                }
              : undefined,
            sessionToken: sessionTokenRef.current ?? undefined,
          });

        const nextPredictions = suggestions
          .map((suggestion) => suggestion.placePrediction)
          .filter((prediction): prediction is google.maps.places.PlacePrediction =>
            Boolean(prediction)
          )
          .slice(0, 6)
          .map((prediction, index) => {
            const description = prediction.text.toString();

            return {
              description,
              id: prediction.placeId || `${description}-${index}`,
              mainText: prediction.mainText?.toString() ?? description,
              placePrediction: prediction,
              secondaryText: prediction.secondaryText?.toString(),
            };
          });

        if (isActive) {
          setPredictions(nextPredictions);
          setShowPredictions(nextPredictions.length > 0);
        }
      } catch {
        if (isActive) {
          setPredictions([]);
        }
      } finally {
        if (isActive) {
          setIsPredictionLoading(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [isReady, isSearchInteracting, searchValue, selectedPosition]);

  const handlePredictionSelect = async (prediction: GooglePlacePrediction) => {
    setSearchValue(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
    setIsSearchInteracting(false);

    try {
      const place = prediction.placePrediction.toPlace();
      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });

      const location = toLatLngLiteral(place.location);

      if (!location) {
        throw new Error("Place has no location.");
      }

      applyPickerPosition(
        location,
        place.formattedAddress ?? place.displayName ?? prediction.description
      );
      sessionTokenRef.current = placesLibraryRef.current
        ? new placesLibraryRef.current.AutocompleteSessionToken()
        : null;
    } catch {
      handleSearch(prediction.description);
    }
  };

  const handleSearch = (searchOverride?: string) => {
    const value = (searchOverride ?? searchValue).trim();
    const coordinateMatch = value.match(
      /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
    );

    if (coordinateMatch) {
      reverseGeocodePosition({
        lat: Number(coordinateMatch[1]),
        lng: Number(coordinateMatch[2]),
      });
      return;
    }

    if (!value) {
      toast.error("Enter an address or coordinates.");
      return;
    }

    geocoderRef.current?.geocode({ address: value }, (results, status) => {
      const result = results?.[0];
      const position = toLatLngLiteral(result?.geometry.location);

      if (!(status === "OK" && position)) {
        toast.error("Unable to find that location.");
        return;
      }

      applyPickerPosition(position, result?.formatted_address ?? value);
    });
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    const mapCenter = toLatLngLiteral(mapRef.current?.getCenter());
    const fallbackPosition =
      selectedPosition ?? mapCenter ?? googleMapsPublicConfig.defaultCenter;

    resolveCurrentPosition(fallbackPosition)
      .then((position) => reverseGeocodePosition(position))
      .finally(() => setIsLocating(false));
  };

  return (
    <GoogleMapPickerLayout
      className={className}
      isLoading={isLoading}
      isLocating={isLocating}
      isPredictionLoading={isPredictionLoading}
      isReady={isReady}
      isSearchInteracting={isSearchInteracting}
      loadError={loadError}
      onLocate={handleUseCurrentLocation}
      onPredictionSelect={handlePredictionSelect}
      onSearch={() => handleSearch()}
      predictions={predictions}
      searchValue={searchValue}
      selectedPosition={selectedPosition}
      setIsSearchInteracting={setIsSearchInteracting}
      setSearchValue={setSearchValue}
      setShowPredictions={setShowPredictions}
      showPredictions={showPredictions}
    >
      <div className={MAP_VIEW_CLASS_NAME} ref={mapElementRef} />
    </GoogleMapPickerLayout>
  );
}

function GoogleMapPickerVisgl(props: Omit<GoogleMapPickerProps, "variant">) {
  const [loadError, setLoadError] = useState<string | null>(null);

  return (
    <APIProvider
      apiKey={googleMapsPublicConfig.apiKey}
      libraries={[...googleMapsPublicConfig.libraries]}
      onError={(error) => {
        setLoadError(
          error instanceof Error ? error.message : "Unable to load Google Maps."
        );
      }}
      onLoad={() => setLoadError(null)}
      region={googleMapsPublicConfig.regionCode}
      solutionChannel=""
      version={googleMapsPublicConfig.version}
    >
      <GoogleMapPickerVisglContent {...props} loadError={loadError} />
    </APIProvider>
  );
}

function GoogleMapPickerVisglContent({
  address,
  className,
  latitude,
  loadError,
  longitude,
  onChange,
}: Omit<GoogleMapPickerProps, "variant"> & { loadError: string | null }) {
  const map = useMap();
  const isApiLoaded = useApiIsLoaded();
  const placesLibrary = useMapsLibrary("places");
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const onChangeRef = useRef(onChange);
  const searchValueRef = useRef(address ?? "");
  const initialSelectedPosition = useMemo(
    () => toInitialPosition(latitude, longitude),
    [latitude, longitude]
  );
  const initialPosition = useMemo(
    () => initialSelectedPosition ?? googleMapsPublicConfig.defaultCenter,
    [initialSelectedPosition]
  );
  const [camera, setCamera] = useState({
    center: initialPosition,
    zoom: initialSelectedPosition ? 16 : 5,
  });
  const [mapTypeId, setMapTypeId] = useState<VisglMapTypeId>("roadmap");
  const [searchValue, setSearchValueState] = useState(address ?? "");
  const [selectedPosition, setSelectedPosition] =
    useState<GoogleMapsLatLngLiteral | null>(initialSelectedPosition);
  const [isLocating, setIsLocating] = useState(false);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isSearchInteracting, setIsSearchInteracting] = useState(false);
  const [isGeocoderReady, setIsGeocoderReady] = useState(false);
  const isReady = Boolean(
    isApiLoaded && map && placesLibrary && isGeocoderReady && !loadError
  );
  const isLoading = !loadError && !isReady;

  const setSearchValue = (value: string) => {
    setSearchValueState(value);
    searchValueRef.current = value;
  };

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (address !== undefined) {
      setSearchValue(address ?? "");
      setPredictions([]);
      setShowPredictions(false);
      setIsSearchInteracting(false);
    }
  }, [address]);

  useEffect(() => {
    if (!isApiLoaded) {
      geocoderRef.current = null;
      setIsGeocoderReady(false);
      return;
    }

    geocoderRef.current = new google.maps.Geocoder();
    setIsGeocoderReady(true);

    if (placesLibrary) {
      sessionTokenRef.current = new placesLibrary.AutocompleteSessionToken();
    }
  }, [isApiLoaded, placesLibrary]);

  const applyPickerPosition = (
    position: GoogleMapsLatLngLiteral,
    nextAddress?: string | null
  ) => {
    setCamera({ center: position, zoom: 16 });
    setSelectedPosition(position);

    if (nextAddress !== undefined) {
      setSearchValue(nextAddress ?? "");
    }

    onChangeRef.current({
      address: nextAddress ?? (searchValueRef.current.trim() || null),
      latitude: position.lat,
      longitude: position.lng,
    });
    setPredictions([]);
    setShowPredictions(false);
    setIsSearchInteracting(false);
  };

  const reverseGeocodePosition = (
    position: GoogleMapsLatLngLiteral,
    preferredAddress?: string | null
  ) => {
    const geocoder = geocoderRef.current;

    if (!geocoder) {
      applyPickerPosition(position, preferredAddress);
      return;
    }

    geocoder.geocode({ location: position }, (results) => {
      applyPickerPosition(
        position,
        preferredAddress ?? results?.[0]?.formatted_address ?? null
      );
    });
  };

  useEffect(() => {
    const trimmedSearch = searchValue.trim();
    let isActive = true;

    if (
      !(
        isReady &&
        isSearchInteracting &&
        placesLibrary &&
        trimmedSearch.length >= 2
      )
    ) {
      setPredictions([]);
      setIsPredictionLoading(false);
      return;
    }

    setIsPredictionLoading(true);
    const timeout = window.setTimeout(async () => {
      try {
        const { suggestions } =
          await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            includedRegionCodes: [googleMapsPublicConfig.regionCode],
            input: trimmedSearch,
            locationBias: selectedPosition
              ? {
                  center: selectedPosition,
                  radius: 50_000,
                }
              : undefined,
            sessionToken: sessionTokenRef.current ?? undefined,
          });

        const nextPredictions = suggestions
          .map((suggestion) => suggestion.placePrediction)
          .filter((prediction): prediction is google.maps.places.PlacePrediction =>
            Boolean(prediction)
          )
          .slice(0, 6)
          .map((prediction, index) => {
            const description = prediction.text.toString();

            return {
              description,
              id: prediction.placeId || `${description}-${index}`,
              mainText: prediction.mainText?.toString() ?? description,
              placePrediction: prediction,
              secondaryText: prediction.secondaryText?.toString(),
            };
          });

        if (isActive) {
          setPredictions(nextPredictions);
          setShowPredictions(nextPredictions.length > 0);
        }
      } catch {
        if (isActive) {
          setPredictions([]);
        }
      } finally {
        if (isActive) {
          setIsPredictionLoading(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, [
    isReady,
    isSearchInteracting,
    placesLibrary,
    searchValue,
    selectedPosition,
  ]);

  const handlePredictionSelect = async (prediction: GooglePlacePrediction) => {
    setSearchValue(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
    setIsSearchInteracting(false);

    try {
      const place = prediction.placePrediction.toPlace();
      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });

      const location = toLatLngLiteral(place.location);

      if (!location) {
        throw new Error("Place has no location.");
      }

      applyPickerPosition(
        location,
        place.formattedAddress ?? place.displayName ?? prediction.description
      );
      sessionTokenRef.current = placesLibrary
        ? new placesLibrary.AutocompleteSessionToken()
        : null;
    } catch {
      handleSearch(prediction.description);
    }
  };

  const handleSearch = (searchOverride?: string) => {
    const value = (searchOverride ?? searchValue).trim();
    const coordinateMatch = value.match(
      /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
    );

    if (coordinateMatch) {
      reverseGeocodePosition({
        lat: Number(coordinateMatch[1]),
        lng: Number(coordinateMatch[2]),
      });
      return;
    }

    if (!value) {
      toast.error("Enter an address or coordinates.");
      return;
    }

    geocoderRef.current?.geocode({ address: value }, (results, status) => {
      const result = results?.[0];
      const position = toLatLngLiteral(result?.geometry.location);

      if (!(status === "OK" && position)) {
        toast.error("Unable to find that location.");
        return;
      }

      applyPickerPosition(position, result?.formatted_address ?? value);
    });
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    const fallbackPosition = selectedPosition ?? camera.center;

    resolveCurrentPosition(fallbackPosition)
      .then((position) => reverseGeocodePosition(position))
      .finally(() => setIsLocating(false));
  };

  const handleCameraChanged = (event: MapCameraChangedEvent) => {
    setCamera({
      center: event.detail.center,
      zoom: event.detail.zoom,
    });
  };

  const handleZoomIn = () => {
    setCamera((current) => ({
      ...current,
      zoom: Math.min(VISGL_MAX_ZOOM, current.zoom + 1),
    }));
  };

  const handleZoomOut = () => {
    setCamera((current) => ({
      ...current,
      zoom: Math.max(VISGL_MIN_ZOOM, current.zoom - 1),
    }));
  };

  const handleRecenterSelected = () => {
    const center = selectedPosition ?? initialPosition;
    setCamera((current) => ({
      center,
      zoom: selectedPosition ? Math.max(current.zoom, 16) : current.zoom,
    }));
  };

  const handleResetView = () => {
    setCamera({
      center: googleMapsPublicConfig.defaultCenter,
      zoom: 5,
    });
  };

  const handleToggleMapType = () => {
    setMapTypeId((current) => (current === "roadmap" ? "satellite" : "roadmap"));
  };

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      reverseGeocodePosition(event.detail.latLng);
    }
  };

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    const position = toLatLngLiteral(event.latLng);

    if (position) {
      reverseGeocodePosition(position);
    }
  };

  return (
    <GoogleMapPickerLayout
      className={className}
      isLoading={isLoading}
      isLocating={isLocating}
      isPredictionLoading={isPredictionLoading}
      isReady={isReady}
      isSearchInteracting={isSearchInteracting}
      loadError={loadError}
      onLocate={handleUseCurrentLocation}
      onPredictionSelect={handlePredictionSelect}
      onSearch={() => handleSearch()}
      predictions={predictions}
      searchValue={searchValue}
      selectedPosition={selectedPosition}
      setIsSearchInteracting={setIsSearchInteracting}
      setSearchValue={setSearchValue}
      setShowPredictions={setShowPredictions}
      showPredictions={showPredictions}
    >
      <Map
        center={camera.center}
        className={MAP_VIEW_CLASS_NAME}
        clickableIcons={false}
        disableDefaultUI
        gestureHandling="greedy"
        mapId={googleMapsPublicConfig.mapId}
        mapTypeId={mapTypeId}
        onCameraChanged={handleCameraChanged}
        onClick={handleMapClick}
        reuseMaps
        zoom={camera.zoom}
      >
        <AdvancedMarker
          anchorLeft="-50%"
          anchorTop="-100%"
          className="flex size-9 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          draggable
          onDragEnd={handleMarkerDragEnd}
          position={selectedPosition ?? camera.center}
          title="Selected map location"
        >
          <IconMapPin className="size-5 fill-current" />
        </AdvancedMarker>
      </Map>
      <VisglMapControls
        cameraCenter={camera.center}
        mapTypeId={mapTypeId}
        onRecenterSelected={handleRecenterSelected}
        onResetView={handleResetView}
        onToggleMapType={handleToggleMapType}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        selectedPosition={selectedPosition}
        zoom={camera.zoom}
      />
    </GoogleMapPickerLayout>
  );
}

type VisglMapControlsProps = {
  cameraCenter: GoogleMapsLatLngLiteral;
  mapTypeId: VisglMapTypeId;
  onRecenterSelected: () => void;
  onResetView: () => void;
  onToggleMapType: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  selectedPosition: GoogleMapsLatLngLiteral | null;
  zoom: number;
};

function VisglMapControls({
  cameraCenter,
  mapTypeId,
  onRecenterSelected,
  onResetView,
  onToggleMapType,
  onZoomIn,
  onZoomOut,
  selectedPosition,
  zoom,
}: VisglMapControlsProps) {
  return (
    <>
      <div className="absolute top-3 left-3 z-20 flex items-center border bg-background shadow-sm">
        <Button
          className={cn(
            "rounded-none px-3",
            mapTypeId === "roadmap" && "bg-muted text-foreground"
          )}
          leftIcon={<IconMap2 className="size-4" />}
          onClick={mapTypeId === "roadmap" ? undefined : onToggleMapType}
          type="button"
          variant="ghost"
        >
          Map
        </Button>
        <Button
          className={cn(
            "rounded-none px-3",
            mapTypeId === "satellite" && "bg-muted text-foreground"
          )}
          leftIcon={<IconMap className="size-4" />}
          onClick={mapTypeId === "satellite" ? undefined : onToggleMapType}
          type="button"
          variant="ghost"
        >
          Satellite
        </Button>
      </div>
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <div className="flex flex-col overflow-hidden border bg-background shadow-sm">
          <Button
            disabled={zoom >= VISGL_MAX_ZOOM}
            onClick={onZoomIn}
            size="icon"
            title="Zoom in"
            type="button"
            variant="ghost"
          >
            <IconZoomIn className="size-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button
            disabled={zoom <= VISGL_MIN_ZOOM}
            onClick={onZoomOut}
            size="icon"
            title="Zoom out"
            type="button"
            variant="ghost"
          >
            <IconZoomOut className="size-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
        </div>
        <div className="flex flex-col overflow-hidden border bg-background shadow-sm">
          <Button
            disabled={!selectedPosition}
            onClick={onRecenterSelected}
            size="icon"
            title="Center selected location"
            type="button"
            variant="ghost"
          >
            <IconFocusCentered className="size-4" />
            <span className="sr-only">Center selected location</span>
          </Button>
          <Button
            onClick={onResetView}
            size="icon"
            title="Reset view"
            type="button"
            variant="ghost"
          >
            <IconMap className="size-4" />
            <span className="sr-only">Reset view</span>
          </Button>
        </div>
      </div>
      <div className="absolute right-3 bottom-8 left-3 z-20 flex flex-wrap items-center gap-2">
        <div className="flex min-h-8 items-center gap-2 border bg-background/95 px-2 text-muted-foreground text-xs shadow-sm backdrop-blur">
          <IconMapPin className="size-3.5 text-primary" />
          <span className="font-medium text-foreground">
            {selectedPosition
              ? `${formatCoordinate(selectedPosition.lat)}, ${formatCoordinate(
                  selectedPosition.lng
                )}`
              : "No coordinates"}
          </span>
        </div>
        <div className="flex min-h-8 items-center gap-2 border bg-background/95 px-2 text-muted-foreground text-xs shadow-sm backdrop-blur">
          <IconFocusCentered className="size-3.5" />
          <span>
            {formatCoordinate(cameraCenter.lat)}, {formatCoordinate(cameraCenter.lng)}
          </span>
          <span className="text-border">|</span>
          <span>{Math.round(zoom)}x</span>
        </div>
      </div>
    </>
  );
}
