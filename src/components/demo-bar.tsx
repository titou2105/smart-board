"use client";

import { useTransition } from "react";
import { resetDemo } from "@/app/[locale]/actions";

export interface DemoBarLabels {
  notice: string;
  reset: string;
  resetting: string;
  confirm: string;
}

/**
 * Online demo only (US-3.2): tells the visitor where their tasks are kept (the cookie notice)
 * and lets them start over from the sample list, after a confirmation.
 */
export function DemoBar({ labels }: { labels: DemoBarLabels }) {
  const [pending, startTransition] = useTransition();

  function reset() {
    // The browser's own confirmation box: simple, accessible, and enough for a demo.
    if (!window.confirm(labels.confirm)) return;
    startTransition(async () => {
      await resetDemo();
    });
  }

  return (
    <aside className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
      <p className="min-w-0 flex-1 basis-60">{labels.notice}</p>
      <button
        type="button"
        onClick={reset}
        disabled={pending}
        className="inline-flex min-h-11 items-center rounded-md bg-secondary px-4 font-medium text-foreground disabled:opacity-60"
      >
        {pending ? labels.resetting : labels.reset}
      </button>
    </aside>
  );
}
