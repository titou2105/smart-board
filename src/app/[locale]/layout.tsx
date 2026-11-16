import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Inter is the design system font. Its variable is mapped to --font-sans in globals.css.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// One static version of every page per language (/en, /fr), served at "/" by the proxy.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Tells next-intl the language without reading request headers, so the page stays static.
  setRequestLocale(locale);

  return (
    // suppressHydrationWarning: next-themes adds the "dark" class before React loads, on purpose.
    <html lang={locale} className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
