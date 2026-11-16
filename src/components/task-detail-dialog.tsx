"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { postponeToTomorrow, setTaskStatus } from "@/app/[locale]/actions";
import type { TaskStatus } from "@/core/task";
import { cn } from "@/lib/utils";

/** Everything the dialog shows, already formatted and translated on the server. */
export interface TaskDetailView {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueLong: string;
  overdue: boolean;
  statusLabel: string;
  originLabel: string;
  categoryLabel: string | null;
}

export interface TaskDetailLabels {
  close: string;
  description: string;
  dueDate: string;
  status: string;
  origin: string;
  overdue: string;
  markDone: string;
  reopen: string;
  start: string;
  tomorrow: string;
}

const BUTTON = "inline-flex min-h-11 items-center rounded-md px-4 font-semibold disabled:opacity-60";

/**
 * Task detail (US-2.3): a sheet rising from the bottom on a phone, a panel on the right on a computer.
 * Native <dialog>: Escape closes it and keyboard focus stays inside, with no extra library.
 * The open task lives in the URL (?task=…), so the phone's Back button closes it too.
 */
export function TaskDetailDialog({ task, closeHref, labels }: { task: TaskDetailView; closeHref: string; labels: TaskDetailLabels }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, [task.id]);

  // Closing (Escape, ✕, click outside, or after an action) removes ?task= from the URL.
  const onClose = () => router.replace(closeHref, { scroll: false });

  function run(action: () => Promise<{ ok: boolean }>) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) dialogRef.current?.close();
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close(); // click on the dimmed backdrop
      }}
      aria-labelledby="task-detail-title"
      className={cn(
        "m-0 mt-auto max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-lg border bg-card p-0 text-foreground shadow-float backdrop:bg-black/40",
        "sm:mt-0 sm:ml-auto sm:h-dvh sm:max-h-none sm:w-[400px] sm:rounded-none sm:border-y-0 sm:border-r-0",
      )}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 id="task-detail-title" className="pt-2 text-xl font-semibold">
            {task.title}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.close}
            className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary"
          >
            ✕
          </button>
        </div>

        <dl className="flex flex-col gap-3">
          <div>
            <dt className="text-xs font-semibold tracking-[.06em] text-muted-foreground uppercase">{labels.description}</dt>
            <dd className="mt-1">{task.description}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[.06em] text-muted-foreground uppercase">{labels.dueDate}</dt>
            <dd className={cn("mt-1", task.overdue && "font-medium text-destructive")}>
              {task.dueLong}
              {task.overdue && ` · ${labels.overdue}`}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[.06em] text-muted-foreground uppercase">{labels.status}</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <span className={cn(task.status === "in_progress" && "rounded-sm bg-primary px-1.5 text-sm font-semibold text-primary-foreground")}>
                {task.statusLabel}
              </span>
              {task.categoryLabel && <span className="rounded-sm bg-secondary px-1.5 text-xs">{task.categoryLabel}</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[.06em] text-muted-foreground uppercase">{labels.origin}</dt>
            <dd className="mt-1 text-muted-foreground">{task.originLabel}</dd>
          </div>
        </dl>

        {/* One primary action (design system), the others secondary. */}
        <div className="flex flex-wrap gap-2 pt-2">
          {task.status === "done" ? (
            <button type="button" disabled={pending} onClick={() => run(() => setTaskStatus(task.id, "todo"))} className={cn(BUTTON, "bg-primary text-primary-foreground")}>
              {labels.reopen}
            </button>
          ) : (
            <button type="button" disabled={pending} onClick={() => run(() => setTaskStatus(task.id, "done"))} className={cn(BUTTON, "bg-primary text-primary-foreground")}>
              {labels.markDone}
            </button>
          )}
          {task.status === "todo" && (
            <button type="button" disabled={pending} onClick={() => run(() => setTaskStatus(task.id, "in_progress"))} className={cn(BUTTON, "bg-secondary")}>
              {labels.start}
            </button>
          )}
          {task.status !== "done" && (
            <button type="button" disabled={pending} onClick={() => run(() => postponeToTomorrow(task.id))} className={cn(BUTTON, "bg-secondary")}>
              {labels.tomorrow}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
