"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { IconCamera, IconQrcode, IconX } from "@xbase/icons/tabler";
import {
  type CodeScanResult,
  isCodeScannerSupported,
  scanCodeFromCamera,
  stopCameraStream,
} from "@xbase/utility/scanners/code";
import { useCallback, useEffect, useRef, useState } from "react";

type ScannerStatus = "idle" | "scanning" | "scanned" | "error";

const getErrorMessage = (error: unknown) => {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Camera permission was denied.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to scan code.";
};

export function CodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [result, setResult] = useState<CodeScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ScannerStatus>("idle");

  const stopScan = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    if (videoRef.current) {
      stopCameraStream(videoRef.current);
    }

    setStatus((currentStatus) =>
      currentStatus === "scanning" ? "idle" : currentStatus
    );
  }, []);

  const startScan = useCallback(async () => {
    if (!videoRef.current) {
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setError(null);
    setResult(null);
    setStatus("scanning");

    try {
      const scannedCode = await scanCodeFromCamera({
        signal: abortController.signal,
        video: videoRef.current,
      });

      setResult(scannedCode);
      setStatus("scanned");
    } catch (scanError) {
      if (
        scanError instanceof DOMException &&
        scanError.name === "AbortError"
      ) {
        setStatus("idle");
        return;
      }

      setError(getErrorMessage(scanError));
      setStatus("error");
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setIsSupported(isCodeScannerSupported());

    return () => {
      stopScan();
    };
  }, [stopScan]);

  const isScanning = status === "scanning";

  return (
    <div className="rounded-md border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-medium text-sm">QR / barcode scanner</h2>
        <div className="flex items-center gap-2">
          <Button
            disabled={!isSupported || isScanning}
            leftIcon={<IconCamera />}
            loading={isScanning}
            loadingText="Scanning"
            onClick={startScan}
            size="sm"
            type="button"
          >
            Scan
          </Button>
          <Button
            disabled={!isScanning}
            leftIcon={<IconX />}
            onClick={stopScan}
            size="sm"
            type="button"
            variant="outline"
          >
            Stop
          </Button>
        </div>
      </div>

      <div className="mt-3 aspect-video overflow-hidden rounded-md border bg-black">
        <video
          aria-label="Code scanner camera preview"
          className="size-full object-cover"
          muted
          playsInline
          ref={videoRef}
        />
      </div>

      <div className="mt-3 min-h-10 rounded-md bg-muted px-3 py-2 text-sm">
        {result ? (
          <div className="flex items-start gap-2">
            <IconQrcode className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-muted-foreground text-xs">
                {result.format ?? "code"}
              </div>
              <div className="break-all font-mono">{result.value}</div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            {error ??
              (isSupported
                ? "Scanned value will appear here."
                : "Camera code scanning is not supported in this browser.")}
          </p>
        )}
      </div>
    </div>
  );
}
