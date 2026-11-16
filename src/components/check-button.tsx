"use client";

import { useOptimistic, useTransition } from "react";
import { setTaskDone } from "@/app/[locale]/actions";
import { cn } from "@/lib/utils";

/**
 * Round checkbox of a task (design system: 22 px circle inside a 44 px touch target).
 * The tick shows immediately ("optimistic"), then the server confirms; if it fails, it goes back.
 */
export function CheckButton({ id, done, label }: { id: string; done: boolean; label: string }) {
  const [, startTransition] = useTransition();
  const [shownDone, setShownDone] = useOptimistic(done);

  function toggle() {
    startTransition(async () => {
      setShownDone(!shownDone);
      await setTaskDone(id, !shownDone);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={shownDone}
      aria-label={label}
      className="grid size-11 shrink-0 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-ring"
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid size-[22px] place-items-center rounded-full border-[1.5px] text-xs font-semibold transition-colors",
          shownDone ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-transparent",
        )}
      >
        ✓
      </span>
    </button>
  );
}
