import { readFile, writeFile } from "node:fs/promises";
import { TaskSourceError, type TaskRepository } from "@/core/task-repository";
import { emptyTaskFile, updateTask, validateTaskFile, type TaskFile } from "@/core/task-file";

/**
 * Reads and updates the tasks written by /tache in data/tasks.json (server side only).
 * A missing file simply means "no task yet"; an invalid file is an error worth showing.
 */
export function createFileRepository(path: string): TaskRepository {
  async function load(): Promise<TaskFile> {
    let text: string;
    try {
      text = await readFile(path, "utf-8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyTaskFile();
      throw new TaskSourceError(`Impossible de lire ${path}.`);
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new TaskSourceError(`${path} n'est pas un JSON valide.`);
    }
    const result = validateTaskFile(data);
    if (!result.ok) throw new TaskSourceError(`${path} est invalide.`, result.errors);
    return result.file;
  }

  return {
    async list() {
      return (await load()).tasks;
    },

    async update(id, changes) {
      // Same rules as /tache (npm run tasks:update): nothing is written if the change is invalid.
      const result = updateTask(await load(), id, changes, new Date());
      if (!result.ok) throw new TaskSourceError("La tâche n'a pas été modifiée.", result.errors);
      await writeFile(path, JSON.stringify(result.file, null, 2) + "\n", "utf-8");
      return result.after;
    },
  };
}
