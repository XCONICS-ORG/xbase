import { readFileSync } from "node:fs";

export interface PwaThemeColorOptions {
  backgroundVariable?: string;
  cssPath: string;
  themeVariable?: string;
}

export interface PwaThemeColors {
  backgroundColor: string;
  themeColor: string;
}

const ROOT_BLOCK_RE = /:root\s*\{(?<body>[\s\S]*?)\}/;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const toSrgbChannel = (value: number) => {
  const normalized = clamp(value);
  const srgb =
    normalized <= 0.003_130_8
      ? 12.92 * normalized
      : 1.055 * normalized ** (1 / 2.4) - 0.055;

  return Math.round(clamp(srgb) * 255);
};

const toHexChannel = (value: number) => value.toString(16).padStart(2, "0");

const oklchToHex = (value: string) => {
  const match = value
    .trim()
    .match(
      /^oklch\(\s*(?<lightness>[\d.]+%?)\s+(?<chroma>[\d.]+)\s+(?<hue>[\d.]+)(?:deg)?(?:\s*\/\s*[\d.]+%?)?\s*\)$/i
    );

  const { chroma: rawChroma, hue: rawHue, lightness: rawLightness } =
    match?.groups ?? {};

  if (!(rawChroma && rawHue && rawLightness)) {
    return value;
  }

  const lightness = rawLightness.endsWith("%")
    ? Number.parseFloat(rawLightness) / 100
    : Number.parseFloat(rawLightness);
  const chroma = Number.parseFloat(rawChroma);
  const hue = (Number.parseFloat(rawHue) * Math.PI) / 180;
  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);

  const longL = lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b;
  const longM = lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b;
  const longS = lightness - 0.089_484_177_5 * a - 1.291_485_548 * b;
  const l = longL ** 3;
  const m = longM ** 3;
  const s = longS ** 3;

  const red = toSrgbChannel(
    4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s
  );
  const green = toSrgbChannel(
    -1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s
  );
  const blue = toSrgbChannel(
    -0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s
  );

  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`;
};

const extractRootVariable = (css: string, variable: string) => {
  const rootBody = css.match(ROOT_BLOCK_RE)?.groups?.body ?? css;
  const pattern = new RegExp(
    `--${variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*([^;]+);`
  );
  const value = rootBody.match(pattern)?.[1]?.trim();

  if (!value) {
    throw new Error(`Could not find --${variable} in globals.css.`);
  }

  return value;
};

export function getPwaThemeColors({
  backgroundVariable = "background",
  cssPath,
  themeVariable = "primary",
}: PwaThemeColorOptions): PwaThemeColors {
  const css = readFileSync(cssPath, "utf8");

  return {
    backgroundColor: oklchToHex(extractRootVariable(css, backgroundVariable)),
    themeColor: oklchToHex(extractRootVariable(css, themeVariable)),
  };
}
