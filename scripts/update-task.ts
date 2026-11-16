/**
 * Applies a change validated by Thomas to one task of data/tasks.json. Used by the /tache skill.
 * Reads from standard input: { "id": "t-20261114-1", "changes": { "status": "done" } }
 * Allowed changes: title, description, dueDate (YYYY-MM-DD), status (todo | in_progress | done), category.
 * Run: npm run --silent tasks:update < change.json   (TASKS_FILE=... to target another file, e.g. in tests)
 */
import { readFile, writeFile } from "node:fs/promises";
import { updateTask, validateTaskFile, type TaskChanges } from "../src/core/task-file";

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

async function main() {
  let input: { id?: string; changes?: TaskChanges };
  try {
    input = JSON.parse(await readStdin());
  } catch (error) {
    fail(`Entrée JSON illisible : ${(error as Error).message}`);
  }
  if (!input.id || !input.changes) fail('Entrée attendue : { "id": "…", "changes": { … } }');

  let text: string;
  try {
    text = await readFile(path, "utf-8");
  } catch {
    fail(`${path} introuvable : aucune tâche à modifier.`);
  }
  const loaded = validateTaskFile(JSON.parse(text));
  if (!loaded.ok) fail(`${path} est invalide, rien n'a été modifié :`, loaded.errors);

  const result = updateTask(loaded.file, input.id, input.changes, new Date());
  if (!result.ok) fail("Rien n'a été modifié :", result.errors);

  await writeFile(path, JSON.stringify(result.file, null, 2) + "\n", "utf-8");
  console.log(`✅ Tâche ${result.after.id} · ${result.after.title} mise à jour :`);
  for (const key of Object.keys(input.changes) as (keyof TaskChanges)[]) {
    console.log(`  - ${key} : ${String(result.before[key] ?? "—")} → ${String(result.after[key] ?? "—")}`);
  }
}

main();
