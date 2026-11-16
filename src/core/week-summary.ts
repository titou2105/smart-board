/**
 * "Where am I this week?" — the weekly summary shown above the list (US-2.5).
 * Pure TypeScript: "today" is passed in, so it is easy to test and reuse on mobile.
 */
import { addDays } from "./due-groups";
import type { Task } from "./task";

/** Category filter of the list. "all" shows everything; other values match task.category. */
export type CategoryFilter = "all" | "perso" | "pro";
export const CATEGORY_FILTERS: CategoryFilter[] = ["all", "perso", "pro"];

export function parseCategoryFilter(value: unknown): CategoryFilter {
  return CATEGORY_FILTERS.includes(value as CategoryFilter) ? (value as CategoryFilter) : "all";
}

export function filterByCategory(tasks: Task[], filter: CategoryFilter): Task[] {
  return filter === "all" ? tasks : tasks.filter((task) => task.category === filter);
}

/** Monday and Sunday (YYYY-MM-DD) of the calendar week containing `today`. */
export function weekBounds(today: string): { monday: string; sunday: string } {
  const dayOfWeek = new Date(today + "T00:00:00Z").getUTCDay(); // 0 = Sunday … 6 = Saturday
  const monday = addDays(today, -((dayOfWeek + 6) % 7));
  return { monday, sunday: addDays(monday, 6) };
}

export interface WeekSummary {
  /** Tasks planned this week: due this week, overdue and still open, or finished this week. */
  planned: number;
  done: number;
  /** Open tasks currently in progress (whatever their due date). */
  inProgress: number;
  /** 0 to 100, rounded. */
  percent: number;
}

export function summarizeWeek(tasks: Task[], today: string): WeekSummary {
  const { monday, sunday } = weekBounds(today);
  const inWeek = (date: string) => date >= monday && date <= sunday;

  const planned = tasks.filter((task) => {
    if (inWeek(task.dueDate)) return true;
    if (task.status === "done") return inWeek(task.updatedAt.slice(0, 10)); // finished this week
    return task.dueDate < monday; // overdue and still open
  });
  const done = planned.filter((task) => task.status === "done").length;
  return {
    planned: planned.length,
    done,
    inProgress: tasks.filter((task) => task.status === "in_progress").length,
    percent: planned.length === 0 ? 0 : Math.round((done / planned.length) * 100),
  };
}
