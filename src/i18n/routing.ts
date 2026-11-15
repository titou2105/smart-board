import { defineRouting } from "next-intl/routing";

/**
 * Supported languages. The locale never appears in the URL ("never"): the proxy
 * picks it from the browser language (or a cookie) and rewrites internally to /en or /fr.
 */
export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "never",
});

export type Locale = (typeof routing.locales)[number];
