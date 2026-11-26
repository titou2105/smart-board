"use server";

import { refresh } from "next/cache";
import { addDays, APP_TIME_ZONE, todayIn } from "@/core/due-groups";
import { isTaskCategory, TASK_STATUSES, type TaskStatus } from "@/core/task";
import type { TaskChanges } from "@/core/task-file";
import { hasFieldErrors, validateTaskFields, type TaskFieldErrors } from "@/core/task-validation";
import { getTaskRepository, isDemoMode, resetDemoTasks } from "@/lib/tasks";
import { DemoFullError } from "@/lib/tasks/demo-repository";

// Server Actions run on the server: the browser never touches data/tasks.json directly.
// Their inputs come from the browser, so each one checks them before use.

async function applyChange(id: string, changes: TaskChanges): Promise<{ ok: boolean; demoFull?: boolean }> {
  if (typeof id !== "string" || !id.trim()) return { ok: false };
  try {
    await getTaskRepository().update(id, changes);
  } catch (error) {
    return { ok: false, demoFull: error instanceof DemoFullError };
  }
  refresh(); // re-render the page with the updated list and weekly summary
  return { ok: true };
}

/** "Réinitialiser" on the online demo (US-3.2): back to the sample list. Does nothing on real tasks. */
export async function resetDemo(): Promise<{ ok: boolean }> {
  if (!isDemoMode()) return { ok: false };
  await resetDemoTasks();
  refresh();
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

/** State of the "correct a task" form, kept between submissions by useActionState. */
export interface TaskFormState {
  status: "idle" | "saved" | "error";
  errors?: TaskFieldErrors;
  /** What the user typed, so a refused form keeps its values. */
  values?: { title: string; description: string; dueDate: string; category?: string };
  /** Changes on each successful save, so the form knows it can switch back to the detail. */
  savedAt?: number;
  /** The online demo has no room left (US-3.2): the form suggests resetting it. */
  demoFull?: boolean;
}

/**
 * Corrects the title, description or due date of a task (US-2.6).
 * The fields are validated again here: never trust what the browser sends.
 */
export async function updateTaskFields(id: string, _previous: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const values = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    dueDate: String(formData.get("dueDate") ?? "").trim(),
  };
  const errors = validateTaskFields(values);
  if (hasFieldErrors(errors)) return { status: "error", errors, values };

  const result = await applyChange(id, values);
  return result.ok ? { status: "saved", savedAt: Date.now() } : { status: "error", values, demoFull: result.demoFull };
}

/**
 * Adds a task typed by hand in the app (US-2.2): status "todo", source "manual".
 * Category is optional: "" means none; any other value than perso / pro is refused.
 */
export async function createTask(_previous: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const values = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    dueDate: String(formData.get("dueDate") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
  };
  const errors = validateTaskFields(values);
  if (hasFieldErrors(errors)) return { status: "error", errors, values };
  if (values.category && !isTaskCategory(values.category)) return { status: "error", values };

  try {
    await getTaskRepository().add({ ...values, category: values.category || undefined, source: "manual" });
  } catch (error) {
    return { status: "error", values, demoFull: error instanceof DemoFullError };
  }
  refresh();
  return { status: "saved", savedAt: Date.now() };
}

/** "Demain": moves the due date to tomorrow, in Paris time (US-2.3). */
export async function postponeToTomorrow(id: string): Promise<{ ok: boolean }> {
  return applyChange(id, { dueDate: addDays(todayIn(APP_TIME_ZONE), 1) });
}
