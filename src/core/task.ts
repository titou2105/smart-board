/**
 * Business model of a task.
 * Pure TypeScript, no React or Next.js import: this folder will be reused as-is
 * by the future mobile app (Expo).
 */

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Where the task came from. "mail" will come with the integrations (M4). */
export const TASK_SOURCES = ["claude-code", "manual", "mail"] as const;
export type TaskSource = (typeof TASK_SOURCES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  dueDate: string;
  status: TaskStatus;
  source: TaskSource;
  /** ISO timestamps. */
  createdAt: string;
  updatedAt: string;
  /** Optional free label, e.g. "perso" or "pro". Optional fields can be added later without breaking old tasks. */
  category?: string;
}

/** A task being built by the assistant: every field may still be missing. */
export type TaskDraft = Partial<Pick<Task, "title" | "description" | "dueDate">>;

/** Fields the assistant must collect before a task can be created. */
export const REQUIRED_FIELDS = ["title", "description", "dueDate"] as const;
export type RequiredField = (typeof REQUIRED_FIELDS)[number];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real calendar date in YYYY-MM-DD format (rejects 2026-02-30). */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Returns the required fields that are still empty or invalid, in the order they should be asked. */
export function findMissingFields(draft: TaskDraft): RequiredField[] {
  return REQUIRED_FIELDS.filter((field) => {
    const value = draft[field]?.trim();
    if (!value) return true;
    // A date that is not a real YYYY-MM-DD date counts as missing: the assistant must ask again.
    if (field === "dueDate") return !isIsoDate(value);
    return false;
  });
}

export function isDraftComplete(draft: TaskDraft): boolean {
  return findMissingFields(draft).length === 0;
}
