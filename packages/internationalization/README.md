# @turtle/internationalization

Shared locale setup for Turtle apps.

## Server pages

Use the package helper instead of reading `params.locale` manually in every page.

```tsx
import {
  generateLocaleStaticParams,
  getI18n,
  type LocaleParams,
} from "@turtle/internationalization";

interface PageProperties {
  params: LocaleParams;
}

export const generateStaticParams = generateLocaleStaticParams;

export const generateMetadata = async ({ params }: PageProperties) => {
  const { dictionary } = await getI18n(params);

  return createMetadata(dictionary.metadata);
};

export default async function Page({ params }: PageProperties) {
  const { dictionary, locale } = await getI18n(params);

  return <main lang={locale}>{dictionary.home.title}</main>;
}
```

## Client navigation

Use `useSwitchLocale` for language selectors. It preserves the current path and only swaps the locale prefix.

```tsx
"use client";

import { languageOptions } from "@turtle/internationalization/locales";
import { useSwitchLocale } from "@turtle/internationalization/navigation";

export const LanguageMenu = () => {
  const switchLocale = useSwitchLocale();

  return languageOptions.map(({ label, value }) => (
    <button key={value} onClick={() => switchLocale(value)}>
      {label}
    </button>
  ));
};
```

## Add a language

1. Add the locale to `languine.json`.
2. Add the translated dictionary in `dictionaries/{locale}.json`.
3. Add the human label in `locales.ts`.
4. Run `bun run translate` if you want Languine to generate/update dictionaries.
