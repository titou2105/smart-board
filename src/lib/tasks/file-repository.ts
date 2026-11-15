import { readFile } from "node:fs/promises";
import { TaskSourceError, type TaskRepository } from "@/core/task-repository";
import { validateTaskFile } from "@/core/task-file";

/**
 * Reads the tasks written by /tache in data/tasks.json (server side only).
 * A missing file simply means "no task yet"; an invalid file is an error worth showing.
 */
export function createFileRepository(path: string): TaskRepository {
  return {
    async list() {
      let text: string;
      try {
        text = await readFile(path, "utf-8");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
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
      return result.file.tasks;
    },
  };
}
