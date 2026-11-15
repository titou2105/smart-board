/**
 * Groups tasks by urgency for the "by due date" view.
 * Pure TypeScript: "today" is passed in, so the logic is easy to test and reuse on mobile.
 */
import type { Task } from "./task";

/** The time zone used to decide what "today" means (Thomas lives in France; servers run in UTC). */
export const APP_TIME_ZONE = "Europe/Paris";

/** Display order of the groups of open tasks. */
export const DUE_GROUPS = ["overdue", "today", "next7Days", "later"] as const;
export type DueGroup = (typeof DUE_GROUPS)[number];

export type GroupedTasks = Record<DueGroup, Task[]> & { done: Task[] };

/** Today's date (YYYY-MM-DD) in the given time zone. "en-CA" happens to format dates as YYYY-MM-DD. */
export function todayIn(timeZone: string, now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Adds days to a YYYY-MM-DD date, in UTC to avoid daylight-saving surprises. */
export function addDays(isoDate: string, days: number): string {
  const date = new Date(isoDate + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function groupOf(dueDate: string, today: string, in7Days: string): DueGroup {
  // YYYY-MM-DD strings compare correctly as plain text.
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  if (dueDate <= in7Days) return "next7Days";
  return "later";
}

const byDueDate = (a: Task, b: Task) => a.dueDate.localeCompare(b.dueDate) || a.createdAt.localeCompare(b.createdAt);

/** Splits tasks into urgency groups (each sorted by due date); finished tasks go apart in "done". */
export function groupByDueDate(tasks: Task[], today: string): GroupedTasks {
  const in7Days = addDays(today, 7);
  const groups: GroupedTasks = { overdue: [], today: [], next7Days: [], later: [], done: [] };
  for (const task of [...tasks].sort(byDueDate)) {
    if (task.status === "done") groups.done.push(task);
    else groups[groupOf(task.dueDate, today, in7Days)].push(task);
  }
  return groups;
}
