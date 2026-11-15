import type { TaskRepository } from "@/core/task-repository";
import { mockTasks } from "@/mocks/tasks";
import { createFileRepository } from "./file-repository";

const mockRepository: TaskRepository = {
  async list() {
    return mockTasks;
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
