import { formatDistance, isValid, type Locale, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export type DateTimeInput = Date | number | string;

export const DATE_TIME_FORMATS = {
  date: "YYYY-MM-DD", // 2026-06-23
  dateOrdinalMonth: "Do MMMM", // 23rd June
  dateOrdinalMonthYear: "Do MMMM, YYYY", // 23rd June, 2026
  dateSlash: "MM/DD/YYYY", // 06/23/2026
  dateTime: "YYYY-MM-DD HH:mm", // 2026-06-23 10:30
  dateTimeShort: "MM/DD/YYYY HH:mm", // 06/23/2026 10:30
  dateTimeWithSeconds: "YYYY-MM-DD HH:mm:ss", // 2026-06-23 10:30:45
  day: "DD", // 23
  hour12: "hh", // 10
  hour24: "HH", // 10
  minute: "mm", // 30
  monthName: "MMMM", // June
  monthNumber: "MM", // 06
  monthShort: "MMM", // Jun
  monthYear: "MMMM YYYY", // June 2026
  second: "ss", // 45
  time: "HH:mm", // 10:30
  time12Hour: "hh:mm A", // 10:30 AM
  timeWithSeconds: "HH:mm:ss", // 10:30:45
  weekday: "dddd", // Tuesday
  weekdayShort: "ddd", // Tue
  year: "YYYY", // 2026
  yearShort: "YY", // 26
} as const;

export type DateTimeFormat = keyof typeof DATE_TIME_FORMATS;
export type DateTimeFormatPreset = DateTimeFormat;
export type DateTimeFormatPattern = DateTimeFormat;

export const dateTimeFormatPresets = DATE_TIME_FORMATS;
export const dateTimeFormatPatterns = DATE_TIME_FORMATS;
export const DATE_TIME_PATTERNS = DATE_TIME_FORMATS;
export const MOMENT_DATE_TIME_FORMATS = DATE_TIME_FORMATS;

export interface FormatDateTimeOptions {
  fallback?: string;
  formatKey?: DateTimeFormat;
  locale?: Locale;
  pattern?: string;
  preset?: DateTimeFormat;
  timeZone?: string;
}

export interface FormatRelativeTimeOptions {
  addSuffix?: boolean;
  fallback?: string;
  includeSeconds?: boolean;
  locale?: Locale;
  now?: DateTimeInput;
}

export function getBrowserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function toDate(value: DateTimeInput) {
  const date =
    typeof value === "string" ? parseISO(value) : new Date(value.valueOf());

  return isValid(date) ? date : null;
}

function toDateFnsPattern(pattern: string) {
  return pattern
    .replaceAll("YYYY", "yyyy")
    .replaceAll("YY", "yy")
    .replaceAll("dddd", "EEEE")
    .replaceAll("ddd", "EEE")
    .replaceAll("DD", "dd")
    .replaceAll("D", "d")
    .replaceAll("A", "a");
}

export function normalizeDateTimePattern(pattern: string) {
  return toDateFnsPattern(pattern);
}

export function formatDateTime(
  value: DateTimeInput,
  {
    fallback = "",
    formatKey,
    locale,
    pattern,
    preset = "dateTime",
    timeZone,
  }: FormatDateTimeOptions = {}
) {
  const date = toDate(value);

  if (!date) {
    return fallback;
  }

  const selectedPattern =
    pattern ??
    DATE_TIME_FORMATS[formatKey ?? preset] ??
    DATE_TIME_FORMATS.dateTime;
  const dateFnsPattern = toDateFnsPattern(selectedPattern);
  const options = locale ? { locale } : undefined;

  return formatInTimeZone(
    date,
    timeZone ?? getBrowserTimeZone(),
    dateFnsPattern,
    options
  );
}

export function formatDate(
  value: DateTimeInput,
  options?: FormatDateTimeOptions
) {
  return formatDateTime(value, {
    preset: "date",
    ...options,
  });
}

export function formatTime(
  value: DateTimeInput,
  options?: FormatDateTimeOptions
) {
  return formatDateTime(value, {
    preset: "time",
    ...options,
  });
}

export function formatRelativeTime(
  value: DateTimeInput,
  {
    addSuffix = true,
    fallback = "",
    includeSeconds = false,
    locale,
    now = new Date(),
  }: FormatRelativeTimeOptions = {}
) {
  const date = toDate(value);
  const baseDate = toDate(now);

  if (!(date && baseDate)) {
    return fallback;
  }

  return formatDistance(date, baseDate, {
    addSuffix,
    includeSeconds,
    ...(locale ? { locale } : {}),
  });
}
