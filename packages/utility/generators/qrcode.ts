import type {
  QRCodeDataURLType,
  QRCodeErrorCorrectionLevel,
  QRCodeMaskPattern,
  QRCodeStringType,
} from "qrcode";
import QRCode from "qrcode";

export interface GenerateQrCodeOptions {
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  margin?: number;
  maskPattern?: QRCodeMaskPattern;
  scale?: number;
  type?: QRCodeStringType;
  value: string;
  version?: number;
  width?: number;
}

export interface GenerateQrCodeDataUrlOptions
  extends Omit<GenerateQrCodeOptions, "type"> {
  type?: QRCodeDataURLType;
}

export async function generateQrCode({
  value,
  type = "svg",
  ...options
}: GenerateQrCodeOptions) {
  return await QRCode.toString(value, {
    type,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    margin: options.margin ?? 2,
    ...options,
  });
}

export async function generateQrCodeDataUrl({
  value,
  ...options
}: GenerateQrCodeDataUrlOptions) {
  return await QRCode.toDataURL(value, {
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M",
    margin: options.margin ?? 2,
    width: options.width ?? 256,
    ...options,
  });
}

export const generateQRCode = generateQrCode;
export const generateQRCodeDataUrl = generateQrCodeDataUrl;
export const generateQrcode = generateQrCode;
export const generateQrcodeDataUrl = generateQrCodeDataUrl;
