import { addTasks, CURRENT_SCHEMA_VERSION, updateTask, type TaskFile } from "@/core/task-file";
import { TaskSourceError, type TaskRepository } from "@/core/task-repository";
import type { Locale } from "@/i18n/routing";
import { buildSampleTasks } from "@/mocks/tasks";
import { decodeDemoTasks, DEMO_COOKIE_MAX_LENGTH, DEMO_MAX_TASKS, encodeDemoTasks } from "./demo-cookie";

/** Where the demo keeps its cookie. Injected so the tests can use a fake one instead of a real browser. */
export interface DemoCookieJar {
  read(): Promise<string | undefined>;
  write(value: string): Promise<void>;
}

/** Thrown when the visitor's demo has no room left: the screen asks them to reset it. */
export class DemoFullError extends TaskSourceError {
  constructor() {
    super("La démo est pleine : réinitialise-la pour continuer.");
    this.name = "DemoFullError";
  }
}

/**
 * Demo repository (DATA_PROVIDER=mock): the visitor's own list, kept in their browser cookie.
 * No cookie yet (first visit, or after "Réinitialiser") means the sample list, dated around today and written
 * in the visitor's language. Once saved, the tasks are the visitor's own: they keep the language they were saved in.
 */
export function createDemoRepository(
  jar: DemoCookieJar,
  today: () => string,
  locale: () => Locale | Promise<Locale>,
): TaskRepository {
  async function load(): Promise<TaskFile> {
    const saved = decodeDemoTasks(await jar.read());
    return saved ?? { schemaVersion: CURRENT_SCHEMA_VERSION, tasks: buildSampleTasks(today(), await locale()) };
  }

  async function save(file: TaskFile): Promise<void> {
    const value = encodeDemoTasks(file);
    if (value.length > DEMO_COOKIE_MAX_LENGTH) throw new DemoFullError();
    await jar.write(value);
  }

  return {
    async list() {
      return (await load()).tasks;
    },
    async update(id, changes) {
      const result = updateTask(await load(), id, changes, new Date());
      if (!result.ok) throw new TaskSourceError("La tâche n'a pas été modifiée.", result.errors);
      await save(result.file);
      return result.after;
    },
    async add(input) {
      const file = await load();
      if (file.tasks.length >= DEMO_MAX_TASKS) throw new DemoFullError();
      const result = addTasks(file, [input], new Date());
      if (!result.ok) throw new TaskSourceError("La tâche n'a pas été ajoutée.", result.errors);
      await save(result.file);
      return result.added[0];
    },
  };
}
