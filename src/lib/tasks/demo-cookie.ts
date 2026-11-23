import { deflateRawSync, inflateRawSync } from "node:zlib";
import { validateTaskFile, type TaskFile } from "@/core/task-file";

/**
 * Online demo storage (US-3.2): each visitor's tasks live in a cookie of their own browser.
 *
 * Legal note (CNIL, French cookie rules): this cookie is first-party, used for nothing but keeping the
 * visitor's own demo tasks (like a shopping cart), never for tracking. Cookies "strictly necessary for a
 * service expressly requested by the user" are exempt from consent, so no consent banner; the page says it.
 */
export const DEMO_COOKIE = "smart-board-demo";

/** Browsers accept about 4096 bytes per cookie (name and attributes included): keep a safety margin. */
export const DEMO_COOKIE_MAX_LENGTH = 3800;

/** Keeps the demo small enough for one cookie, and readable. */
export const DEMO_MAX_TASKS = 25;

/** Kept 30 days after the last change, then the visitor gets the sample list again. */
export const DEMO_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** JSON, compressed (about 3x smaller for French text), in characters allowed in a cookie. */
export function encodeDemoTasks(file: TaskFile): string {
  return deflateRawSync(JSON.stringify(file)).toString("base64url");
}

/** Reads the cookie back. Returns null if it is missing, damaged or edited by hand: the demo then starts over. */
export function decodeDemoTasks(value: string | undefined): TaskFile | null {
  if (!value) return null;
  try {
    const data: unknown = JSON.parse(inflateRawSync(Buffer.from(value, "base64url")).toString("utf8"));
    const result = validateTaskFile(data);
    return result.ok ? result.file : null;
  } catch {
    return null;
  }
}
