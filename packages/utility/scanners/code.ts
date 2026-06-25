export type CodeScanFormat =
  | "aztec"
  | "codabar"
  | "code_39"
  | "code_93"
  | "code_128"
  | "data_matrix"
  | "ean_8"
  | "ean_13"
  | "itf"
  | "pdf417"
  | "qr_code"
  | "upc_a"
  | "upc_e";

export interface CodeScanResult {
  boundingBox?: DOMRectReadOnly;
  format?: string;
  value: string;
}

export interface ScanCodeFromCameraOptions {
  constraints?: MediaStreamConstraints;
  formats?: readonly CodeScanFormat[];
  scanIntervalMs?: number;
  signal?: AbortSignal;
  stopOnScan?: boolean;
  video: HTMLVideoElement;
}

interface DetectedBarcode {
  boundingBox?: DOMRectReadOnly;
  format?: string;
  rawValue: string;
}

type BarcodeDetectorConstructor = new (options?: {
  formats?: readonly string[];
}) => {
  detect: (source: HTMLVideoElement) => Promise<DetectedBarcode[]>;
};

type WindowWithBarcodeDetector = Window & {
  BarcodeDetector?: BarcodeDetectorConstructor;
};

export const codeScannerFormats = [
  "qr_code",
  "aztec",
  "data_matrix",
  "pdf417",
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "ean_13",
  "ean_8",
  "itf",
  "upc_a",
  "upc_e",
] as const satisfies readonly CodeScanFormat[];

export function isCodeScannerSupported() {
  return (
    typeof window !== "undefined" &&
    "BarcodeDetector" in window &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

export function stopCameraStream(video: HTMLVideoElement) {
  const stream = video.srcObject;

  if (stream instanceof MediaStream) {
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }

  video.pause();
  video.srcObject = null;
}

const getVideoConstraints = (constraints?: MediaStreamConstraints) => {
  if (constraints?.video === false) {
    return false;
  }

  if (typeof constraints?.video === "object") {
    return {
      facingMode: { ideal: "environment" },
      ...constraints.video,
    };
  }

  return { facingMode: { ideal: "environment" } };
};

export async function scanCodeFromCamera({
  constraints,
  formats = codeScannerFormats,
  scanIntervalMs = 180,
  signal,
  stopOnScan = true,
  video,
}: ScanCodeFromCameraOptions): Promise<CodeScanResult> {
  if (!isCodeScannerSupported()) {
    throw new Error(
      "Camera barcode scanning is not supported in this browser."
    );
  }

  if (signal?.aborted) {
    throw new DOMException("Scan aborted.", "AbortError");
  }

  const BarcodeDetector = (window as WindowWithBarcodeDetector).BarcodeDetector;

  if (!BarcodeDetector) {
    throw new Error("BarcodeDetector is not available.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    ...constraints,
    audio: false,
    video: getVideoConstraints(constraints),
  });

  if (signal?.aborted) {
    for (const track of stream.getTracks()) {
      track.stop();
    }

    throw new DOMException("Scan aborted.", "AbortError");
  }

  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  await video.play();

  const detector = new BarcodeDetector({ formats });

  return await new Promise<CodeScanResult>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let settled = false;

    const cleanup = (stopStream: boolean) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      signal?.removeEventListener("abort", handleAbort);

      if (stopStream) {
        stopCameraStream(video);
      }
    };

    const settle = (
      callback: () => void,
      { stopStream = true }: { stopStream?: boolean } = {}
    ) => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup(stopStream);
      callback();
    };

    const handleAbort = () => {
      settle(() => reject(new DOMException("Scan aborted.", "AbortError")), {
        stopStream: true,
      });
    };

    const scan = async () => {
      if (settled) {
        return;
      }

      try {
        if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          timeoutId = setTimeout(scan, scanIntervalMs);
          return;
        }

        const codes = await detector.detect(video);
        const code = codes.find((item) => item.rawValue);

        if (code) {
          settle(
            () =>
              resolve({
                boundingBox: code.boundingBox,
                format: code.format,
                value: code.rawValue,
              }),
            { stopStream: stopOnScan }
          );
          return;
        }

        timeoutId = setTimeout(scan, scanIntervalMs);
      } catch (error) {
        settle(() => reject(error), { stopStream: true });
      }
    };

    signal?.addEventListener("abort", handleAbort, { once: true });
    timeoutId = setTimeout(scan, 0);
  });
}
