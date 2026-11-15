import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TaskList } from "@/components/task-list";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">Smart Board</h1>
        <p className="text-muted-foreground">{t("tagline")}</p>
      </header>
      {/* The header is static; the list streams in at request time. */}
      <Suspense fallback={<p className="text-muted-foreground">{t("loading")}</p>}>
        <TaskList />
      </Suspense>
    </main>
  );
}
