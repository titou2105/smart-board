import { describe, expect, it } from "vitest";
import { validateTaskFile } from "./task-file";

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
