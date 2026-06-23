"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
  defaultLocale,
  getLocalizedPathname,
  type Locale,
  normalizeLocale,
} from "./locales";

interface LocaleRouteParams {
  locale?: string;
  [key: string]: string | string[] | undefined;
}

export const useCurrentLocale = (): Locale => {
  const params = useParams<LocaleRouteParams>();

  return normalizeLocale(params.locale ?? defaultLocale);
};

export const useLocalizedPathname = () => {
  const pathname = usePathname();
  const currentLocale = useCurrentLocale();

  return (targetLocale: string) =>
    getLocalizedPathname({
      currentLocale,
      pathname,
      targetLocale,
    });
};

export const useSwitchLocale = () => {
  const router = useRouter();
  const getPathname = useLocalizedPathname();

  return (targetLocale: string) => {
    router.push(getPathname(targetLocale));
  };
};
