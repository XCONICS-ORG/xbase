import { toSVG } from "bwip-js/generic";

const leadingHashPattern = /^#/;

export interface GenerateBarcodeOptions {
  backgroundColor?: string;
  bcid?: string;
  height?: number;
  includeText?: boolean;
  scale?: number;
  text: string;
  textAlign?: "center" | "left" | "right";
  textColor?: string;
}

function normalizeColor(value: string) {
  return value.replace(leadingHashPattern, "");
}

export function generateBarcode({
  backgroundColor,
  bcid = "code128",
  height = 10,
  includeText = true,
  scale = 2,
  text,
  textAlign = "center",
  textColor,
}: GenerateBarcodeOptions) {
  return toSVG({
    bcid,
    text,
    scale,
    height,
    includetext: includeText,
    textxalign: textAlign,
    ...(backgroundColor
      ? { backgroundcolor: normalizeColor(backgroundColor) }
      : {}),
    ...(textColor ? { textcolor: normalizeColor(textColor) } : {}),
  });
}
