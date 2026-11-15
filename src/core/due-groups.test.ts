import { describe, expect, it } from "vitest";
import { addDays, groupByDueDate, todayIn } from "./due-groups";
import type { Task } from "./task";

function task(id: string, dueDate: string, status: Task["status"] = "todo"): Task {
  return {
    id,
    title: id,
    description: "d",
    dueDate,
    status,
    source: "manual",
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
  };
}

const ids = (tasks: Task[]) => tasks.map((t) => t.id);

describe("groupByDueDate", () => {
  const today = "2026-11-15";

  it("puts each open task in the right urgency group", () => {
    const groups = groupByDueDate(
      [
        task("late", "2026-11-10"),
        task("now", "2026-11-15"),
        task("tomorrow", "2026-11-16"),
        task("day7", "2026-11-22"),
        task("day8", "2026-11-23"),
      ],
      today,
    );
    expect(ids(groups.overdue)).toEqual(["late"]);
    expect(ids(groups.today)).toEqual(["now"]);
    expect(ids(groups.next7Days)).toEqual(["tomorrow", "day7"]);
    expect(ids(groups.later)).toEqual(["day8"]);
  });

  it("sorts by due date inside a group", () => {
    const groups = groupByDueDate([task("b", "2026-11-20"), task("a", "2026-11-17")], today);
    expect(ids(groups.next7Days)).toEqual(["a", "b"]);
  });

  it("sets finished tasks apart, even when overdue", () => {
    const groups = groupByDueDate([task("finished", "2026-11-01", "done"), task("doing", "2026-11-01", "in_progress")], today);
    expect(ids(groups.done)).toEqual(["finished"]);
    expect(ids(groups.overdue)).toEqual(["doing"]);
  });
});

describe("dates", () => {
  it("adds days across months", () => {
    expect(addDays("2026-11-28", 7)).toEqual("2026-12-05");
  });

  it("computes today in Paris, not in UTC", () => {
    // 23:30 UTC on Nov 15 is already Nov 16 in Paris.
    expect(todayIn("Europe/Paris", new Date("2026-11-15T23:30:00Z"))).toEqual("2026-11-16");
  });
});
