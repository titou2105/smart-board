/**
 * Field-by-field validation of a task form (correct a task: US-2.6, add a task: US-2.2).
 * Returns error codes, not sentences: each screen translates them (English / French).
 * Pure TypeScript, so the mobile app can reuse it.
 */
import { isIsoDate, type RequiredField, type TaskDraft } from "./task";

export type FieldError = "required" | "invalidDate";
export type TaskFieldErrors = Partial<Record<RequiredField, FieldError>>;

export function validateTaskFields(draft: TaskDraft): TaskFieldErrors {
  const errors: TaskFieldErrors = {};
  if (!draft.title?.trim()) errors.title = "required";
  if (!draft.description?.trim()) errors.description = "required";
  const dueDate = draft.dueDate?.trim();
  if (!dueDate) errors.dueDate = "required";
  else if (!isIsoDate(dueDate)) errors.dueDate = "invalidDate";
  return errors;
}

export function hasFieldErrors(errors: TaskFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
