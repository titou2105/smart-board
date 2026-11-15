import { getTranslations, setRequestLocale } from "next-intl/server";

// Temporary home page: the task list grouped by due date arrives with US-1.5.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Smart Board</h1>
      <p className="text-xl">{t("tagline")}</p>
      <p className="text-muted-foreground">{t("intro")}</p>
      <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">{t("comingSoon")}</p>
    </main>
  );
}
