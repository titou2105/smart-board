/**
 * Adds tasks validated by Thomas to data/tasks.json. Used by the /tache skill.
 * Reads a JSON array (or a single object) of tasks from standard input:
 *   [{ "title": "...", "description": "...", "dueDate": "YYYY-MM-DD", "category": "perso" }]
 * The id, status, source and timestamps are filled by the code (src/core/task-file.ts).
 * Run: npm run --silent tasks:add < tasks.json   (TASKS_FILE=... to target another file, e.g. in tests)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { addTasks, emptyTaskFile, validateTaskFile, type NewTaskInput, type TaskFile } from "../src/core/task-file";

const path = process.env.TASKS_FILE ?? "data/tasks.json";

function fail(message: string, details: string[] = []): never {
  console.error(`❌ ${message}`);
  for (const detail of details) console.error(`  - ${detail}`);
  process.exit(1);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf-8");
}

/** The existing file, or an empty one the first time. A corrupted file stops everything: never overwrite it. */
async function loadFile(): Promise<TaskFile> {
  let text: string;
  try {
    text = await readFile(path, "utf-8");
  } catch {
    return emptyTaskFile();
  }
  const result = validateTaskFile(JSON.parse(text));
  if (!result.ok) fail(`${path} est invalide, rien n'a été ajouté :`, result.errors);
  return result.file;
}

async function main() {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readStdin());
  } catch (error) {
    fail(`Entrée JSON illisible : ${(error as Error).message}`);
  }
  const inputs = (Array.isArray(parsed) ? parsed : [parsed]) as NewTaskInput[];

  const result = addTasks(await loadFile(), inputs, new Date());
  if (!result.ok) fail("Rien n'a été ajouté :", result.errors);

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(result.file, null, 2) + "\n", "utf-8");
  console.log(`✅ ${result.added.length} tâche(s) ajoutée(s) dans ${path} (${result.file.tasks.length} au total) :`);
  for (const task of result.added) console.log(`  - ${task.id} · ${task.dueDate} · ${task.title}`);
}

main();
