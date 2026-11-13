/**
 * Checks data/tasks.json (or the file given as argument) against the task format.
 * Run after every write by /tache: npm run tasks:check
 */
import { readFile } from "node:fs/promises";
import { validateTaskFile } from "../src/core/task-file";

const path = process.argv[2] ?? "data/tasks.json";

async function main() {
  let data: unknown;
  try {
    data = JSON.parse(await readFile(path, "utf-8"));
  } catch (error) {
    console.error(`❌ Impossible de lire ${path} : ${(error as Error).message}`);
    process.exit(1);
  }
  const result = validateTaskFile(data);
  if (!result.ok) {
    console.error(`❌ ${path} est invalide :`);
    for (const error of result.errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`✅ ${path} : ${result.file.tasks.length} tâche(s) valide(s).`);
}

main();
