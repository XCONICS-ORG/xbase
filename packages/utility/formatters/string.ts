export interface FormatStringOptions {
  case?:
    | "camel"
    | "capital"
    | "kebab"
    | "lower"
    | "pascal"
    | "sentence"
    | "title"
    | "upper";
  fallback?: string;
  removeUnderscores?: boolean;
  separator?: string;
  trim?: boolean;
}

const separatorPattern = /[-_\s]+/;
const underscorePattern = /_/g;
const whitespacePattern = /\s+/g;

function splitWords(value: string) {
  return value
    .trim()
    .split(separatorPattern)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

export function formatString(
  value: null | string | undefined,
  {
    case: textCase,
    fallback = "",
    removeUnderscores = false,
    separator,
    trim = true,
  }: FormatStringOptions = {}
) {
  if (value == null) {
    return fallback;
  }

  let next = trim ? value.trim() : value;

  if (removeUnderscores) {
    next = next.replace(underscorePattern, separator ?? " ");
  }

  if (separator) {
    next = next.replace(whitespacePattern, separator);
  }

  if (!textCase) {
    return next;
  }

  const words = splitWords(next);

  switch (textCase) {
    case "camel":
      return words
        .map((word, index) => (index === 0 ? word : capitalize(word)))
        .join("");
    case "capital":
      return capitalize(next.toLowerCase());
    case "kebab":
      return words.join("-");
    case "lower":
      return next.toLowerCase();
    case "pascal":
      return words.map(capitalize).join("");
    case "sentence":
      return capitalize(words.join(" "));
    case "title":
      return words.map(capitalize).join(" ");
    case "upper":
      return next.toUpperCase();
    default:
      return next;
  }
}

export const toCamelCase = (value: string) =>
  formatString(value, { case: "camel" });

export const toKebabCase = (value: string) =>
  formatString(value, { case: "kebab" });

export const toPascalCase = (value: string) =>
  formatString(value, { case: "pascal" });

export const toTitleCase = (value: string) =>
  formatString(value, { case: "title" });

// export function formatStringUnderscoreToSpace(text: null | string | undefined) {
//   if (!text) {
//     return "";
//   }

//   return text.replace(underscorePattern, " ");
// }
