import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 "proxy" (formerly middleware): detects the language and rewrites "/" to "/en" or "/fr" internally.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals and files with an extension (images, favicon…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
