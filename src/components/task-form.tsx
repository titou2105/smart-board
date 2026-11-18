"use client";

import { useActionState, useEffect, useRef } from "react";
import type { TaskFormState } from "@/app/[locale]/actions";
import type { FieldError } from "@/core/task-validation";
import { cn } from "@/lib/utils";

export interface TaskFormLabels {
  title: string;
  description: string;
  dueDate: string;
  save: string;
  saving: string;
  cancel: string;
  errors: Record<FieldError, string>;
  saveFailed: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
}

type FormAction = (state: TaskFormState, formData: FormData) => Promise<TaskFormState>;

const FIELD = "w-full rounded-md border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring";
const LABEL = "text-xs font-semibold tracking-[.06em] text-muted-foreground uppercase";
const BUTTON = "inline-flex min-h-11 items-center rounded-md px-4 font-semibold disabled:opacity-60";

/**
 * Task form: title, description, due date (correct a task: US-2.6, add a task: US-2.2).
 * Errors come back from the server action and show under each field, in the user's language.
 * noValidate: the browser's own messages are skipped, ours are translated and consistent.
 */
export function TaskForm({
  action,
  initial,
  labels,
  onCancel,
  onSaved,
}: {
  action: FormAction;
  initial: TaskFormValues;
  labels: TaskFormLabels;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const titleRef = useRef<HTMLInputElement>(null);
  const values = state.values ?? initial;

  useEffect(() => titleRef.current?.focus(), []);
  useEffect(() => {
    if (state.status === "saved") onSaved();
  }, [state.status, state.savedAt, onSaved]);

  function errorOf(field: keyof TaskFormValues) {
    const code = state.errors?.[field];
    return code ? labels.errors[code] : null;
  }

  const describedBy = (name: keyof TaskFormValues) => (errorOf(name) ? `task-${name}-error` : undefined);

  return (
    // key: when the server sends values back after a refused save, the fields show them.
    <form action={formAction} noValidate className="flex flex-col gap-4" key={state.savedAt ?? JSON.stringify(values)}>
      <Field name="title" label={labels.title} error={errorOf("title")}>
        <input
          ref={titleRef}
          id="task-title"
          name="title"
          defaultValue={values.title}
          aria-invalid={!!errorOf("title")}
          aria-describedby={describedBy("title")}
          className={cn(FIELD, errorOf("title") && "border-destructive")}
        />
      </Field>
      <Field name="description" label={labels.description} error={errorOf("description")}>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          defaultValue={values.description}
          aria-invalid={!!errorOf("description")}
          aria-describedby={describedBy("description")}
          className={cn(FIELD, errorOf("description") && "border-destructive")}
        />
      </Field>
      <Field name="dueDate" label={labels.dueDate} error={errorOf("dueDate")}>
        <input
          id="task-dueDate"
          name="dueDate"
          type="date"
          defaultValue={values.dueDate}
          aria-invalid={!!errorOf("dueDate")}
          aria-describedby={describedBy("dueDate")}
          className={cn(FIELD, errorOf("dueDate") && "border-destructive")}
        />
      </Field>

      {state.status === "error" && !state.errors && (
        <p role="alert" className="text-sm text-destructive">
          {labels.saveFailed}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={pending} className={cn(BUTTON, "bg-primary text-primary-foreground")}>
          {pending ? labels.saving : labels.save}
        </button>
        <button type="button" onClick={onCancel} className={cn(BUTTON, "bg-secondary")}>
          {labels.cancel}
        </button>
      </div>
    </form>
  );
}

/** A labelled field with its error message under it (design system: label visible, error in red under the field). */
function Field({ name, label, error, children }: { name: keyof TaskFormValues; label: string; error: string | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={`task-${name}`} className={LABEL}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`task-${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
