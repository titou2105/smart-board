"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { createTask } from "@/app/[locale]/actions";
import { SHEET_CLASS } from "@/components/task-detail-dialog";
import { TaskForm, type TaskFormLabels } from "@/components/task-form";

/**
 * "Add a task" (US-2.2): same sheet and same form as the detail, with the category in addition.
 * Opened by ?new=1 in the URL, like the detail, so the phone's Back button closes it.
 */
export function AddTaskDialog({ heading, close, closeHref, labels }: { heading: string; close: string; closeHref: string; labels: TaskFormLabels }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const closeDialog = useCallback(() => dialogRef.current?.close(), []);
  // Closing (Escape, ✕, Annuler, click outside, or after saving) removes ?new= from the URL.
  const onClose = () => router.replace(closeHref, { scroll: false });

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) closeDialog(); // click on the dimmed backdrop
      }}
      aria-labelledby="add-task-title"
      className={SHEET_CLASS}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 id="add-task-title" className="pt-2 text-xl font-semibold">
            {heading}
          </h2>
          <button type="button" onClick={closeDialog} aria-label={close} className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary">
            ✕
          </button>
        </div>
        <TaskForm action={createTask} initial={{ title: "", description: "", dueDate: "" }} labels={labels} onCancel={closeDialog} onSaved={closeDialog} />
      </div>
    </dialog>
  );
}
