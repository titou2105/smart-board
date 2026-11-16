"use server";

import { refresh } from "next/cache";
import { getTaskRepository } from "@/lib/tasks";

/**
 * Checks or unchecks a task from the list (US-2.5).
 * A Server Action runs on the server: the browser never touches data/tasks.json directly.
 */
export async function setTaskDone(id: string, done: boolean): Promise<{ ok: boolean }> {
  // Inputs come from the browser: check them before using them.
  if (typeof id !== "string" || !id.trim() || typeof done !== "boolean") return { ok: false };
  try {
    await getTaskRepository().update(id, { status: done ? "done" : "todo" });
  } catch {
    return { ok: false };
  }
  refresh(); // re-render the page with the updated list and weekly summary
  return { ok: true };
}
