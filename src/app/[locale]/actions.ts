"use server";

import { refresh } from "next/cache";
import { addDays, APP_TIME_ZONE, todayIn } from "@/core/due-groups";
import { TASK_STATUSES, type TaskStatus } from "@/core/task";
import type { TaskChanges } from "@/core/task-file";
import { getTaskRepository } from "@/lib/tasks";

// Server Actions run on the server: the browser never touches data/tasks.json directly.
// Their inputs come from the browser, so each one checks them before use.

async function applyChange(id: string, changes: TaskChanges): Promise<{ ok: boolean }> {
  if (typeof id !== "string" || !id.trim()) return { ok: false };
  try {
    await getTaskRepository().update(id, changes);
  } catch {
    return { ok: false };
  }
  refresh(); // re-render the page with the updated list and weekly summary
  return { ok: true };
}

/** Checks or unchecks a task from the list (US-2.5). */
export async function setTaskDone(id: string, done: boolean): Promise<{ ok: boolean }> {
  if (typeof done !== "boolean") return { ok: false };
  return applyChange(id, { status: done ? "done" : "todo" });
}

/** "Commencer", "Marquer comme faite", "Rouvrir" from the task detail (US-2.3). */
export async function setTaskStatus(id: string, status: TaskStatus): Promise<{ ok: boolean }> {
  if (!TASK_STATUSES.includes(status)) return { ok: false };
  return applyChange(id, { status });
}

/** "Demain": moves the due date to tomorrow, in Paris time (US-2.3). */
export async function postponeToTomorrow(id: string): Promise<{ ok: boolean }> {
  return applyChange(id, { dueDate: addDays(todayIn(APP_TIME_ZONE), 1) });
}
