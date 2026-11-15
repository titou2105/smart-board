import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { APP_TIME_ZONE, DUE_GROUPS, groupByDueDate, todayIn, type DueGroup } from "@/core/due-groups";
import type { Task } from "@/core/task";
import { TaskSourceError } from "@/core/task-repository";
import { getTaskRepository } from "@/lib/tasks";

// Provisional "by due date" view (US-1.5); the real design comes with the UI workshop (US-2.1).

const GROUP_ACCENT: Record<DueGroup, string> = {
  overdue: "text-destructive",
  today: "text-foreground",
  next7Days: "text-foreground",
  later: "text-muted-foreground",
};

async function TaskItem({ task }: { task: Task }) {
  const format = await getFormatter();
  // dueDate is a calendar day: format it in UTC so it never shifts by a day.
  const due = format.dateTime(new Date(task.dueDate + "T00:00:00Z"), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  return (
    <li className="rounded-lg border p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-medium">{task.title}</p>
        <p className="shrink-0 text-sm text-muted-foreground">{due}</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
      {task.category && (
        <span className="mt-2 inline-block rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
          {task.category}
        </span>
      )}
    </li>
  );
}

export async function TaskList() {
  // The list depends on the file and on today's date: render it at request time, not at build time.
  await connection();
  const t = await getTranslations("Tasks");

  let tasks: Task[];
  try {
    tasks = await getTaskRepository().list();
  } catch (error) {
    const details = error instanceof TaskSourceError ? error.details : [];
    return (
      <div role="alert" className="rounded-lg border border-destructive p-4 text-sm">
        <p className="font-medium text-destructive">{t("error")}</p>
        <p className="mt-1 text-muted-foreground">{(error as Error).message}</p>
        {details.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-muted-foreground">
            {details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
        )}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">{t("empty")}</p>;
  }

  const groups = groupByDueDate(tasks, todayIn(APP_TIME_ZONE));
  return (
    <div className="flex flex-col gap-8">
      {DUE_GROUPS.filter((group) => groups[group].length > 0).map((group) => (
        <section key={group} aria-labelledby={`group-${group}`}>
          <h2 id={`group-${group}`} className={`mb-3 text-sm font-semibold uppercase tracking-wide ${GROUP_ACCENT[group]}`}>
            {t(`groups.${group}`)} · {groups[group].length}
          </h2>
          <ul className="flex flex-col gap-2">
            {groups[group].map((task) => <TaskItem key={task.id} task={task} />)}
          </ul>
        </section>
      ))}
      {groups.done.length > 0 && (
        <details className="text-muted-foreground">
          <summary className="cursor-pointer text-sm">{t("done", { count: groups.done.length })}</summary>
          <ul className="mt-3 flex flex-col gap-2 opacity-70">
            {groups.done.map((task) => <TaskItem key={task.id} task={task} />)}
          </ul>
        </details>
      )}
    </div>
  );
}
