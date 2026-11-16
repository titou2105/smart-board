import { updateTask } from "@/core/task-file";
import { TaskSourceError, type TaskRepository } from "@/core/task-repository";
import { mockTasks } from "@/mocks/tasks";
import { createFileRepository } from "./file-repository";

// Demo mode keeps changes in server memory only (lost on restart). Per-visitor demo data comes with US-3.2.
let mockFile = { schemaVersion: 1, tasks: structuredClone(mockTasks) };

const mockRepository: TaskRepository = {
  async list() {
    return mockFile.tasks;
  },
  async update(id, changes) {
    const result = updateTask(mockFile, id, changes, new Date());
    if (!result.ok) throw new TaskSourceError("La tâche n'a pas été modifiée.", result.errors);
    mockFile = result.file;
    return result.after;
  },
};

/**
 * Picks where tasks come from with DATA_PROVIDER (mock by default, so the app works with no setup):
 * - mock: realistic sample tasks (online demo);
 * - file: Thomas's real tasks in data/tasks.json (TASKS_FILE to use another path).
 */
export function getTaskRepository(): TaskRepository {
  const provider = process.env.DATA_PROVIDER ?? "mock";
  switch (provider) {
    case "mock":
      return mockRepository;
    case "file":
      return createFileRepository(process.env.TASKS_FILE ?? "data/tasks.json");
    default:
      throw new Error(`DATA_PROVIDER inconnu : "${provider}". Valeurs possibles : mock, file.`);
  }
}
