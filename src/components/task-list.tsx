import Link from "next/link";
import { connection } from "next/server";
import { getFormatter, getTranslations } from "next-intl/server";
import { CheckButton } from "@/components/check-button";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { TaskDetailDialog, type TaskDetailLabels, type TaskDetailView } from "@/components/task-detail-dialog";
import type { TaskFormLabels } from "@/components/task-form";
import { addDays, APP_TIME_ZONE, DUE_GROUPS, groupByDueDate, todayIn, type DueGroup } from "@/core/due-groups";
import type { Task } from "@/core/task";
import { TaskSourceError } from "@/core/task-repository";
import {
  CATEGORY_FILTERS,
  filterByCategory,
  parseCategoryFilter,
  summarizeWeek,
  type CategoryFilter,
  type WeekSummary,
} from "@/core/week-summary";
import { getTaskRepository } from "@/lib/tasks";
import { cn } from "@/lib/utils";

// "My tasks" list, direction A of the UI workshop (US-2.5). Design rules: docs/design.md.

type T = Awaited<ReturnType<typeof getTranslations<"Tasks">>>;
const KNOWN_CATEGORIES = ["perso", "pro"];

function WeekSummaryCard({ summary, t }: { summary: WeekSummary; t: T }) {
  return (
    <section aria-label={t("week.label")} className="rounded-lg border bg-card p-3 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-muted-foreground">
        <p>
          <span className="text-lg font-semibold text-foreground">
            {summary.done} / {summary.planned}
          </span>{" "}
          {t("week.done")}
        </p>
        {summary.inProgress > 0 && (
          <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            {t("week.inProgress", { count: summary.inProgress })}
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-label={t("week.label")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={summary.percent}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"
      >
        <div className="h-full bg-primary transition-all" style={{ width: `${summary.percent}%` }} />
      </div>
    </section>
  );
}

function CategoryFilters({ active, t }: { active: CategoryFilter; t: T }) {
  return (
    <nav aria-label={t("filters.label")} className="flex gap-2">
      {CATEGORY_FILTERS.map((filter) => (
        <Link
          key={filter}
          href={listHref(filter)}
          aria-current={filter === active ? "page" : undefined}
          scroll={false}
          className={cn(
            "inline-flex min-h-11 items-center rounded-md border bg-card px-3 text-sm",
            filter === active && "border-primary bg-accent-soft font-medium text-primary",
          )}
        >
          {t(`filters.${filter}`)}
        </Link>
      ))}
    </nav>
  );
}

function categoryLabel(task: Task, t: T): string | null {
  if (!task.category) return null;
  return KNOWN_CATEGORIES.includes(task.category) ? t(`filters.${task.category as "perso" | "pro"}`) : task.category;
}

/** Link to the current list with other query params: keeps the filter when opening or closing a task. */
function listHref(filter: CategoryFilter, taskId?: string, adding = false) {
  const query: Record<string, string> = {};
  if (filter !== "all") query.filter = filter;
  if (taskId) query.task = taskId;
  if (adding) query.new = "1";
  return { pathname: "/", query };
}

/** The primary action of the screen (design system: one per screen), above the list (US-2.2). */
function AddTaskLink({ filter, t }: { filter: CategoryFilter; t: T }) {
  return (
    <Link
      href={listHref(filter, undefined, true)}
      scroll={false}
      className="inline-flex min-h-11 items-center justify-center self-start rounded-md bg-primary px-4 font-semibold text-primary-foreground"
    >
      {t("add.button")}
    </Link>
  );
}

async function TaskRow({ task, today, showDate, openHref, t }: { task: Task; today: string; showDate: boolean; openHref: ReturnType<typeof listHref>; t: T }) {
  const format = await getFormatter();
  const done = task.status === "done";
  const overdue = !done && task.dueDate < today;
  // dueDate is a calendar day: format it in UTC so it never shifts by a day.
  const shortDate = format.dateTime(new Date(task.dueDate + "T00:00:00Z"), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const relative =
    task.dueDate === today ? t("today") : task.dueDate === addDays(today, 1) ? t("tomorrow") : shortDate;
  const category = categoryLabel(task, t);

  return (
    <li className="flex items-start gap-1 py-1 pr-3 pl-1">
      <CheckButton
        id={task.id}
        done={done}
        label={done ? t("reopen", { title: task.title }) : t("markDone", { title: task.title })}
      />
      {/* The whole text area opens the task detail (US-2.3). */}
      <Link
        href={openHref}
        scroll={false}
        aria-label={t("open", { title: task.title })}
        className="min-w-0 flex-1 rounded-md py-2 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <p className={cn("font-medium", done && "text-muted-foreground line-through")}>{task.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          {overdue ? (
            <span className="font-medium text-destructive">{t("overdueOn", { date: shortDate })}</span>
          ) : (
            showDate && <span>{relative}</span>
          )}
          {task.status === "in_progress" && (
            <span className="rounded-sm bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {t("inProgress")}
            </span>
          )}
          {category && <span className="rounded-sm bg-secondary px-1.5 text-xs">{category}</span>}
        </p>
      </Link>
    </li>
  );
}

const SECTION_LABEL = "mb-2 text-xs font-semibold tracking-[.06em] uppercase";
const GROUP_COLOR: Record<DueGroup, string> = {
  overdue: "text-destructive",
  today: "text-muted-foreground",
  next7Days: "text-muted-foreground",
  later: "text-muted-foreground",
};

export async function TaskList({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // The list depends on the file, the URL filter and today's date: render it at request time.
  await connection();
  const t = await getTranslations("Tasks");
  const params = await searchParams;
  const filter = parseCategoryFilter(params.filter);
  const openTaskId = typeof params.task === "string" ? params.task : undefined;
  const adding = params.new === "1";
  const addTask = adding && <AddTask closeHref={listHref(filter)} />;

  let allTasks: Task[];
  try {
    allTasks = await getTaskRepository().list();
  } catch (error) {
    const details = error instanceof TaskSourceError ? error.details : [];
    return (
      <div role="alert" className="rounded-lg border border-destructive bg-card p-4 text-sm">
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

  if (allTasks.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <AddTaskLink filter={filter} t={t} />
        <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">{t("empty")}</p>
        {addTask}
      </div>
    );
  }

  const today = todayIn(APP_TIME_ZONE);
  const tasks = filterByCategory(allTasks, filter);
  const groups = groupByDueDate(tasks, today);
  const openGroups = DUE_GROUPS.filter((group) => groups[group].length > 0);
  // The detail looks in all tasks, so a link stays valid even if the task is hidden by the filter.
  const openTask = openTaskId ? allTasks.find((task) => task.id === openTaskId) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <AddTaskLink filter={filter} t={t} />
        <WeekSummaryCard summary={summarizeWeek(tasks, today)} t={t} />
        <CategoryFilters active={filter} t={t} />
      </div>

      {openGroups.length === 0 && <p className="text-muted-foreground">{t("emptyFilter")}</p>}

      {openGroups.map((group) => (
        <section key={group} aria-labelledby={`group-${group}`}>
          <h2 id={`group-${group}`} className={cn(SECTION_LABEL, GROUP_COLOR[group])}>
            {t(`groups.${group}`)} · {groups[group].length}
          </h2>
          <ul className="divide-y overflow-hidden rounded-lg border bg-card shadow-card">
            {groups[group].map((task) => (
              <TaskRow key={task.id} task={task} today={today} showDate={group !== "today"} openHref={listHref(filter, task.id)} t={t} />
            ))}
          </ul>
        </section>
      ))}

      {groups.done.length > 0 && (
        <details>
          <summary className="flex min-h-11 cursor-pointer items-center text-sm text-muted-foreground">
            {t("done", { count: groups.done.length })}
          </summary>
          <ul className="mt-2 divide-y overflow-hidden rounded-lg border bg-card">
            {groups.done.map((task) => (
              <TaskRow key={task.id} task={task} today={today} showDate openHref={listHref(filter, task.id)} t={t} />
            ))}
          </ul>
        </details>
      )}

      {openTask && <TaskDetail task={openTask} today={today} closeHref={listHref(filter)} />}
      {addTask}
    </div>
  );
}

/** Formats and translates the open task on the server, then hands it to the dialog (client). */
async function TaskDetail({ task, today, closeHref }: { task: Task; today: string; closeHref: ReturnType<typeof listHref> }) {
  const t = await getTranslations("Tasks");
  const d = await getTranslations("Detail");
  const f = await getTranslations("Form");
  const format = await getFormatter();
  const view: TaskDetailView = {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    status: task.status,
    dueLong: format.dateTime(new Date(task.dueDate + "T00:00:00Z"), { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
    overdue: task.status !== "done" && task.dueDate < today,
    statusLabel: d(`statuses.${task.status}`),
    originLabel: d(`origins.${ORIGIN_KEY[task.source]}`),
    categoryLabel: categoryLabel(task, t),
  };
  const labels: TaskDetailLabels = {
    close: d("close"),
    description: d("description"),
    dueDate: d("dueDate"),
    status: d("status"),
    origin: d("origin"),
    overdue: d("overdue"),
    markDone: d("markDone"),
    reopen: d("reopen"),
    start: d("start"),
    tomorrow: d("tomorrow"),
    edit: d("edit"),
    form: formLabels(f),
  };
  return <TaskDetailDialog task={view} closeHref={hrefString(closeHref)} labels={labels} />;
}

/** Labels of the add form (US-2.2): the correct form's labels plus the category. */
async function AddTask({ closeHref }: { closeHref: ReturnType<typeof listHref> }) {
  const t = await getTranslations("Tasks");
  const f = await getTranslations("Form");
  const labels: TaskFormLabels = {
    ...formLabels(f),
    category: {
      label: f("category"),
      none: f("noCategory"),
      options: { perso: t("filters.perso"), pro: t("filters.pro") },
    },
  };
  return <AddTaskDialog heading={t("add.heading")} close={f("close")} closeHref={hrefString(closeHref)} labels={labels} />;
}

function formLabels(f: Awaited<ReturnType<typeof getTranslations<"Form">>>): TaskFormLabels {
  return {
    title: f("title"),
    description: f("description"),
    dueDate: f("dueDate"),
    save: f("save"),
    saving: f("saving"),
    cancel: f("cancel"),
    saveFailed: f("saveFailed"),
    errors: { required: f("errors.required"), invalidDate: f("errors.invalidDate") },
  };
}

/** A URL object is not serializable for a client component: pass a plain string. */
function hrefString(href: ReturnType<typeof listHref>): string {
  const query = new URLSearchParams(href.query).toString();
  return query ? `/?${query}` : "/";
}

const ORIGIN_KEY = { "claude-code": "assistant", manual: "manual", mail: "mail" } as const;
