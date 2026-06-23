import "server-only";
import type en from "./dictionaries/en.json";
import { type Locale, locales, normalizeLocale } from "./locales";

export type Dictionary = typeof en;

export interface LocaleParamsValue {
  locale?: string;
}

export type LocaleParams = LocaleParamsValue | Promise<LocaleParamsValue>;

const loadDefaultDictionary = () =>
  import("./dictionaries/en.json").then((mod) => mod.default);

const dictionaries: Record<string, () => Promise<Dictionary>> =
  Object.fromEntries(
    locales.map((locale) => [
      locale,
      () =>
        import(`./dictionaries/${locale}.json`)
          .then((mod) => mod.default)
          .catch(() => loadDefaultDictionary()),
    ])
  );

export const generateLocaleStaticParams = () =>
  locales.map((locale) => ({ locale }));

export const getLocale = async (params: LocaleParams): Promise<Locale> => {
  const { locale } = await params;

  return normalizeLocale(locale);
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  const normalizedLocale = normalizeLocale(locale);

  if (!locales.includes(normalizedLocale as Locale)) {
    return loadDefaultDictionary();
  }

  try {
    const loadDictionary =
      dictionaries[normalizedLocale] ?? loadDefaultDictionary;

    return await loadDictionary();
  } catch {
    return loadDefaultDictionary();
  }
};

export const getI18n = async (params: LocaleParams) => {
  const locale = await getLocale(params);
  const dictionary = await getDictionary(locale);

  return {
    dictionary,
    locale,
  };
};
