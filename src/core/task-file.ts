/**
 * Format of data/tasks.json, shared by Claude Code (/tache) and the app.
 * Pure TypeScript (no Node or React import), so it also runs on mobile.
 */
import { REQUIRED_FIELDS, TASK_SOURCES, TASK_STATUSES, isIsoDate, type Task } from "./task";

/** Bump this number when the format changes in a way old files must be migrated. */
export const CURRENT_SCHEMA_VERSION = 1;

export interface TaskFile {
  schemaVersion: number;
  tasks: Task[];
}

export type TaskFileResult = { ok: true; file: TaskFile } | { ok: false; errors: string[] };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): boolean {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

/** Lists what is wrong with one task, prefixed by its position so the error is easy to find. */
function validateTask(raw: unknown, index: number, seenIds: Set<string>): string[] {
  const where = `tâche n°${index + 1}`;
  if (!isObject(raw)) return [`${where} : ce n'est pas un objet.`];

  const errors: string[] = [];
  const id = raw.id;
  if (typeof id !== "string" || !id.trim()) errors.push(`${where} : « id » manquant.`);
  else if (seenIds.has(id)) errors.push(`${where} : l'id « ${id} » existe déjà.`);
  else seenIds.add(id);

  const label = typeof id === "string" ? `${where} (${id})` : where;
  for (const field of REQUIRED_FIELDS) {
    const value = raw[field];
    if (typeof value !== "string" || !value.trim()) errors.push(`${label} : « ${field} » est obligatoire.`);
  }
  if (typeof raw.dueDate === "string" && raw.dueDate.trim() && !isIsoDate(raw.dueDate)) {
    errors.push(`${label} : « dueDate » doit être une date AAAA-MM-JJ (reçu « ${raw.dueDate} »).`);
  }
  if (!TASK_STATUSES.includes(raw.status as never)) {
    errors.push(`${label} : « status » doit valoir ${TASK_STATUSES.join(", ")}.`);
  }
  if (!TASK_SOURCES.includes(raw.source as never)) {
    errors.push(`${label} : « source » doit valoir ${TASK_SOURCES.join(", ")}.`);
  }
  for (const field of ["createdAt", "updatedAt"]) {
    if (!isTimestamp(raw[field])) errors.push(`${label} : « ${field} » doit être une date ISO.`);
  }
  if (raw.category !== undefined && typeof raw.category !== "string") {
    errors.push(`${label} : « category » doit être un texte.`);
  }
  return errors;
}

/**
 * Checks parsed JSON against the task file format.
 * Unknown fields are kept as-is: this is what lets us add optional fields later
 * without breaking existing files.
 */
export function validateTaskFile(data: unknown): TaskFileResult {
  if (!isObject(data)) return { ok: false, errors: ["Le fichier doit contenir un objet JSON."] };
  if (data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    return { ok: false, errors: [`« schemaVersion » doit valoir ${CURRENT_SCHEMA_VERSION} (reçu ${String(data.schemaVersion)}).`] };
  }
  if (!Array.isArray(data.tasks)) return { ok: false, errors: ["« tasks » doit être une liste."] };

  const seenIds = new Set<string>();
  const errors = data.tasks.flatMap((task, index) => validateTask(task, index, seenIds));
  return errors.length > 0 ? { ok: false, errors } : { ok: true, file: data as unknown as TaskFile };
}
