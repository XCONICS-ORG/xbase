import languine from "./languine.json" with { type: "json" };

export const defaultLocale = languine.locale.source;
export const locales = [
  languine.locale.source,
  ...languine.locale.targets,
] as const;

export type Locale = (typeof locales)[number];

export const languageLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  zh: "中文",
};

export const languageOptions = locales.map((locale) => ({
  label: languageLabels[locale],
  value: locale,
}));

export const isLocale = (value: string | undefined): value is Locale =>
  Boolean(value && locales.includes(value as Locale));

export const normalizeLocale = (value: string | undefined): Locale => {
  const normalizedLocale = value?.split("-")[0];

  return isLocale(normalizedLocale) ? normalizedLocale : defaultLocale;
};

export const getLocaleLabel = (locale: string | undefined) =>
  languageLabels[normalizeLocale(locale)];

export const getLocalizedPathname = ({
  currentLocale,
  pathname,
  targetLocale,
}: {
  currentLocale?: string;
  pathname: string;
  targetLocale: string;
}) => {
  const normalizedCurrentLocale = normalizeLocale(currentLocale);
  const normalizedTargetLocale = normalizeLocale(targetLocale);
  const localePrefix = `/${normalizedCurrentLocale}`;
  const pathnameWithLocale = pathname.startsWith(localePrefix)
    ? pathname
    : `${localePrefix}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  return pathnameWithLocale.replace(localePrefix, `/${normalizedTargetLocale}`);
};

export const generateLocaleStaticParams = () =>
  locales.map((locale) => ({ locale }));
