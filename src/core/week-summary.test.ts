import { describe, expect, it } from "vitest";
import type { Task } from "./task";
import { filterByCategory, parseCategoryFilter, summarizeWeek, weekBounds } from "./week-summary";

function task(id: string, dueDate: string, status: Task["status"] = "todo", extra: Partial<Task> = {}): Task {
  return {
    id, title: id, description: "d", dueDate, status, source: "manual",
    createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z", ...extra,
  };
}

describe("weekBounds", () => {
  it("goes from Monday to Sunday", () => {
    expect(weekBounds("2026-11-18")).toEqual({ monday: "2026-11-16", sunday: "2026-11-22" }); // Wednesday
    expect(weekBounds("2026-11-16")).toEqual({ monday: "2026-11-16", sunday: "2026-11-22" }); // Monday
    expect(weekBounds("2026-11-22")).toEqual({ monday: "2026-11-16", sunday: "2026-11-22" }); // Sunday
  });
});

describe("summarizeWeek", () => {
  const today = "2026-11-18";

  it("counts this week's tasks, open overdue ones and tasks finished this week", () => {
    const summary = summarizeWeek(
      [
        task("due-this-week", "2026-11-20"),
        task("overdue-open", "2026-11-10"),
        task("done-this-week", "2026-11-05", "done", { updatedAt: "2026-11-17T09:00:00.000Z" }),
        task("done-last-week", "2026-11-05", "done", { updatedAt: "2026-11-12T09:00:00.000Z" }),
        task("next-week", "2026-11-25"),
      ],
      today,
    );
    expect(summary).toEqual({ planned: 3, done: 1, inProgress: 0, percent: 33 });
  });

  it("counts open tasks in progress, whatever their due date", () => {
    const summary = summarizeWeek([task("a", "2026-12-01", "in_progress"), task("b", "2026-11-19", "in_progress")], today);
    expect(summary.inProgress).toBe(2);
  });

  it("returns 0 % when nothing is planned", () => {
    expect(summarizeWeek([], today)).toEqual({ planned: 0, done: 0, inProgress: 0, percent: 0 });
  });
});

describe("category filter", () => {
  const tasks = [task("p", "2026-11-20", "todo", { category: "perso" }), task("w", "2026-11-20", "todo", { category: "pro" })];

  it("keeps everything with 'all' and filters otherwise", () => {
    expect(filterByCategory(tasks, "all")).toHaveLength(2);
    expect(filterByCategory(tasks, "pro").map((t) => t.id)).toEqual(["w"]);
  });

  it("falls back to 'all' for an unknown value in the URL", () => {
    expect(parseCategoryFilter("perso")).toBe("perso");
    expect(parseCategoryFilter("n'importe quoi")).toBe("all");
    expect(parseCategoryFilter(undefined)).toBe("all");
  });
});
