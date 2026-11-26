import { cookies } from "next/headers";
import { hasLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { APP_TIME_ZONE, todayIn } from "@/core/due-groups";
import type { TaskRepository } from "@/core/task-repository";
import { DEMO_COOKIE, DEMO_COOKIE_MAX_AGE_SECONDS } from "./demo-cookie";
import { createDemoRepository, type DemoCookieJar } from "./demo-repository";
import { createFileRepository } from "./file-repository";

/** The real browser cookie behind the demo. Writing only works in Server Actions (the page itself only reads). */
const browserCookieJar: DemoCookieJar = {
  async read() {
    return (await cookies()).get(DEMO_COOKIE)?.value;
  },
  async write(value) {
    (await cookies()).set(DEMO_COOKIE, value, {
      httpOnly: true, // page scripts cannot read it: only this app's server does
      sameSite: "lax", // never sent along with requests from other sites
      secure: process.env.NODE_ENV === "production", // HTTPS only online (localhost runs on plain HTTP)
      maxAge: DEMO_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  },
};

/** The interface language of the current request (picked by the proxy), so the sample tasks match it. */
async function visitorLocale(): Promise<Locale> {
  const locale = await getLocale();
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/** True for the online demo (and local mock mode): sample tasks, a "Réinitialiser" button, the cookie notice. */
export function isDemoMode(): boolean {
  return (process.env.DATA_PROVIDER ?? "mock") === "mock";
}

/** "Réinitialiser": forgets the visitor's changes, so the sample list (dated today) comes back. */
export async function resetDemoTasks(): Promise<void> {
  (await cookies()).delete(DEMO_COOKIE);
}

/**
 * Picks where tasks come from with DATA_PROVIDER (mock by default, so the app works with no setup):
 * - mock: realistic sample tasks, each visitor's changes kept in their own browser (online demo);
 * - file: Thomas's real tasks in data/tasks.json (TASKS_FILE to use another path).
 */
export function getTaskRepository(): TaskRepository {
  const provider = process.env.DATA_PROVIDER ?? "mock";
  switch (provider) {
    case "mock":
      return createDemoRepository(browserCookieJar, () => todayIn(APP_TIME_ZONE), visitorLocale);
    case "file":
      return createFileRepository(process.env.TASKS_FILE ?? "data/tasks.json");
    default:
      throw new Error(`DATA_PROVIDER inconnu : "${provider}". Valeurs possibles : mock, file.`);
  }
}
