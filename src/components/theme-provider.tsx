"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Puts the "dark" class on <html> when the system is in dark mode (design system rule:
 * dark mode from the first screen). No toggle yet: the app simply follows the system.
 */
export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange {...props} />;
}
