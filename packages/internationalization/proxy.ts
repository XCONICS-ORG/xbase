import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import languine from "./languine.json" with { type: "json" };

const locales = [languine.locale.source, ...languine.locale.targets];
const defaultLocale = languine.locale.source;

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: "rewriteDefault",
  resolveLocaleFromRequest: (request: NextRequest) => {
    try {
      const headers = Object.fromEntries(request.headers.entries());
      const negotiator = new Negotiator({ headers });
      const acceptedLanguages = negotiator
        .languages()
        .filter((language) => language !== "*");

      if (acceptedLanguages.length === 0) {
        return defaultLocale;
      }

      return matchLocale(acceptedLanguages, locales, defaultLocale);
    } catch {
      return defaultLocale;
    }
  },
});

export const internationalizationMiddleware = (request: NextRequest) =>
  I18nMiddleware(request);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
