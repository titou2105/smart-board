import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TaskSourceError } from "@/core/task-repository";
import { createFileRepository } from "./file-repository";

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "smart-board-"));
});
afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("createFileRepository", () => {
  it("returns no task when the file does not exist yet", async () => {
    expect(await createFileRepository(join(dir, "missing.json")).list()).toEqual([]);
  });

  it("reads a valid file", async () => {
    const path = join(dir, "valid.json");
    await writeFile(path, JSON.stringify({
      schemaVersion: 1,
      tasks: [{
        id: "t1", title: "a", description: "b", dueDate: "2026-11-20", status: "todo", source: "manual",
        createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z",
      }],
    }));
    expect(await createFileRepository(path).list()).toHaveLength(1);
  });

  it("explains why a file is invalid", async () => {
    const path = join(dir, "invalid.json");
    await writeFile(path, JSON.stringify({ schemaVersion: 1, tasks: [{ id: "t1" }] }));
    const error = await createFileRepository(path).list().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TaskSourceError);
    expect((error as TaskSourceError).details.length).toBeGreaterThan(0);
  });

  it("rejects a file that is not JSON", async () => {
    const path = join(dir, "broken.json");
    await writeFile(path, "{ oops");
    await expect(createFileRepository(path).list()).rejects.toBeInstanceOf(TaskSourceError);
  });
});

describe("createFileRepository.update", () => {
  it("writes the change to the file and refuses an invalid one", async () => {
    const path = join(dir, "update.json");
    await writeFile(path, JSON.stringify({
      schemaVersion: 1,
      tasks: [{
        id: "t1", title: "a", description: "b", dueDate: "2026-11-20", status: "todo", source: "manual",
        createdAt: "2026-11-15T00:00:00.000Z", updatedAt: "2026-11-15T00:00:00.000Z",
      }],
    }));
    const repository = createFileRepository(path);

    const updated = await repository.update("t1", { status: "done" });
    expect(updated.status).toBe("done");
    expect((await repository.list())[0].status).toBe("done");

    await expect(repository.update("t1", { dueDate: "lundi" })).rejects.toBeInstanceOf(TaskSourceError);
    expect((await repository.list())[0].dueDate).toBe("2026-11-20");
  });
});
