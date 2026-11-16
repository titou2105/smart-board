import { describe, expect, it } from "vitest";
import { addTasks, emptyTaskFile, updateTask, validateTaskFile, type TaskFile } from "./task-file";

const validTask = {
  id: "t1",
  title: "Renouveler le passeport",
  description: "Prendre rendez-vous en mairie.",
  dueDate: "2026-12-15",
  status: "todo",
  source: "claude-code",
  createdAt: "2026-11-13T21:00:00.000Z",
  updatedAt: "2026-11-13T21:00:00.000Z",
};

describe("validateTaskFile", () => {
  it("accepts a valid file", () => {
    const result = validateTaskFile({ schemaVersion: 1, tasks: [validTask] });
    expect(result.ok).toBe(true);
  });

  it("keeps unknown optional fields, so the model can grow without breaking old tasks", () => {
    const result = validateTaskFile({ schemaVersion: 1, tasks: [{ ...validTask, category: "perso", priority: "high" }] });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.file.tasks[0]).toMatchObject({ category: "perso", priority: "high" });
  });

  it("rejects a wrong schema version", () => {
    expect(validateTaskFile({ schemaVersion: 2, tasks: [] }).ok).toBe(false);
  });

  it("explains every problem of an invalid task", () => {
    const result = validateTaskFile({
      schemaVersion: 1,
      tasks: [{ ...validTask, description: "", dueDate: "vendredi", status: "waiting" }],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toHaveLength(3);
      expect(result.errors.join(" ")).toContain("description");
      expect(result.errors.join(" ")).toContain("vendredi");
      expect(result.errors.join(" ")).toContain("status");
    }
  });

  it("rejects duplicate ids", () => {
    const result = validateTaskFile({ schemaVersion: 1, tasks: [validTask, validTask] });
    expect(result.ok).toBe(false);
  });
});

describe("addTasks", () => {
  const now = new Date("2026-11-15T10:30:00.000Z");
  const input = { title: " Appeler le plombier ", description: "Fuite sous l'évier.", dueDate: "2026-11-20", category: "perso" };

  it("fills id, status, source and timestamps", () => {
    const result = addTasks(emptyTaskFile(), [input], now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.added[0]).toEqual({
      id: "t-20261115-1",
      title: "Appeler le plombier",
      description: "Fuite sous l'évier.",
      dueDate: "2026-11-20",
      status: "todo",
      source: "claude-code",
      category: "perso",
      createdAt: "2026-11-15T10:30:00.000Z",
      updatedAt: "2026-11-15T10:30:00.000Z",
    });
  });

  it("never reuses an existing id and keeps existing tasks", () => {
    const first = addTasks(emptyTaskFile(), [input], now);
    if (!first.ok) throw new Error("setup");
    const second = addTasks(first.file, [input, { ...input, title: "Autre" }], now);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.file.tasks.map((task) => task.id)).toEqual(["t-20261115-1", "t-20261115-2", "t-20261115-3"]);
  });

  it("adds nothing when one task is incomplete", () => {
    const result = addTasks(emptyTaskFile(), [input, { ...input, dueDate: "vendredi" }], now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toContain("n°2");
  });

  it("does not mutate the original file", () => {
    const file = emptyTaskFile();
    addTasks(file, [input], now);
    expect(file.tasks).toHaveLength(0);
  });
});

describe("updateTask", () => {
  const now = new Date("2026-11-16T12:00:00.000Z");
  const file = { schemaVersion: 1, tasks: [validTask] } as TaskFile;

  it("changes the status and the update date only", () => {
    const result = updateTask(file, "t1", { status: "done" }, now);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.after).toEqual({ ...validTask, status: "done", updatedAt: "2026-11-16T12:00:00.000Z" });
    expect(result.before.status).toBe("todo");
  });

  it("moves a due date", () => {
    const result = updateTask(file, "t1", { dueDate: "2026-11-20" }, now);
    expect(result.ok && result.file.tasks[0].dueDate).toBe("2026-11-20");
  });

  it("changes nothing when the change is invalid", () => {
    const result = updateTask(file, "t1", { dueDate: "lundi" }, now);
    expect(result.ok).toBe(false);
    expect(file.tasks[0].dueDate).toBe("2026-12-15");
  });

  it("rejects an unknown id", () => {
    const result = updateTask(file, "nope", { status: "done" }, now);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toContain("nope");
  });
});
