/**
 * Business model of a to-do card.
 * Pure TypeScript, no React or Next.js import: this folder will be reused as-is
 * by the future mobile app (Expo).
 */

/** The three Kanban columns of the MVP. */
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  dueDate: string;
  status: TaskStatus;
  /** ISO timestamp, used to sort cards. */
  createdAt: string;
}

/** A card being built by the assistant: every field may still be missing. */
export type TaskDraft = Partial<Pick<Task, "title" | "description" | "dueDate">>;

/** Fields the assistant must collect before a card can be created. */
export const REQUIRED_FIELDS = ["title", "description", "dueDate"] as const;
export type RequiredField = (typeof REQUIRED_FIELDS)[number];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Returns the required fields that are still empty or invalid, in the order they should be asked. */
export function findMissingFields(draft: TaskDraft): RequiredField[] {
  return REQUIRED_FIELDS.filter((field) => {
    const value = draft[field]?.trim();
    if (!value) return true;
    // A date that is not in YYYY-MM-DD format counts as missing: the assistant must ask again.
    if (field === "dueDate") return !ISO_DATE.test(value) || Number.isNaN(Date.parse(value));
    return false;
  });
}

export function isDraftComplete(draft: TaskDraft): boolean {
  return findMissingFields(draft).length === 0;
}
