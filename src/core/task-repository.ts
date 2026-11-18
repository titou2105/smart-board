import type { Task } from "./task";
import type { NewTaskInput, TaskChanges } from "./task-file";

/**
 * Where tasks are stored. The screens only know this interface; the implementation
 * (local file today, browser storage for the demo, Supabase at M3) is picked by DATA_PROVIDER.
 */
export interface TaskRepository {
  /** All tasks. Throws a TaskSourceError with a readable message if the source is broken. */
  list(): Promise<Task[]>;
  /** Changes one task and returns it updated. Throws a TaskSourceError if the change is refused. */
  update(id: string, changes: TaskChanges): Promise<Task>;
  /** Creates one task (id, status "todo" and timestamps are filled in). Throws a TaskSourceError if it is incomplete. */
  add(input: NewTaskInput): Promise<Task>;
}

/** An error whose message can be shown as-is to the user. */
export class TaskSourceError extends Error {
  constructor(message: string, readonly details: string[] = []) {
    super(message);
    this.name = "TaskSourceError";
  }
}
