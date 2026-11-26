import { addDays } from "@/core/due-groups";
import type { Task } from "@/core/task";
import type { Locale } from "@/i18n/routing";

/** The words of a sample task, written once per interface language. */
type SampleText = Record<Locale, Pick<Task, "title" | "description">>;

/**
 * One sample task, with dates written as "days from today" so the demo never looks stale:
 * a visitor in March still sees something late, something for today and something for later.
 */
interface SampleTask extends Omit<Task, "title" | "description" | "dueDate" | "createdAt" | "updatedAt"> {
  text: SampleText;
  dueInDays: number;
  createdDaysAgo: number;
}

// Made-up tasks only: the demo is public, so nothing here may reveal anything about Thomas.
const SAMPLE_TASKS: SampleTask[] = [
  {
    id: "t1",
    text: {
      en: { title: "Call the plumber", description: "The kitchen sink is leaking. Ask for a quote and a slot this week." },
      fr: { title: "Appeler le plombier", description: "L'évier de la cuisine fuit. Demander un devis et un créneau cette semaine." },
    },
    dueInDays: -2,
    createdDaysAgo: 8,
    status: "todo",
    source: "manual",
    category: "perso",
  },
  {
    id: "t2",
    text: {
      en: {
        title: "Send the steering committee minutes",
        description: "Review the notes, list the decisions and action items, then send them to the team.",
      },
      fr: {
        title: "Envoyer le compte rendu du comité",
        description: "Relire les notes, lister les décisions et les actions, puis l'envoyer à l'équipe.",
      },
    },
    dueInDays: 0,
    createdDaysAgo: 1,
    status: "todo",
    source: "claude-code",
    category: "pro",
  },
  {
    id: "t3",
    text: {
      en: { title: "Prepare the Q4 product review", description: "Slides on roadmap progress and KPIs for the steering committee." },
      fr: { title: "Préparer la revue produit T4", description: "Slides sur l'avancement de la roadmap et les KPI pour le comité de pilotage." },
    },
    dueInDays: 3,
    createdDaysAgo: 10,
    status: "in_progress",
    source: "manual",
    category: "pro",
  },
  {
    id: "t4",
    text: {
      en: { title: "Plan the family weekend", description: "Pick a date with everyone, book a cottage and share the shopping list." },
      fr: { title: "Organiser le week-end en famille", description: "Fixer une date avec tout le monde, réserver un gîte et partager la liste de courses." },
    },
    dueInDays: 6,
    createdDaysAgo: 12,
    status: "in_progress",
    source: "manual",
    category: "perso",
  },
  {
    id: "t5",
    text: {
      en: { title: "Renew the passport", description: "Book an appointment at the town hall, bring two photos and a proof of address." },
      fr: { title: "Renouveler le passeport", description: "Prendre rendez-vous en mairie, apporter deux photos et un justificatif de domicile." },
    },
    dueInDays: 21,
    createdDaysAgo: 9,
    status: "todo",
    source: "claude-code",
    category: "perso",
  },
  {
    id: "t6",
    text: {
      en: { title: "Pay the electricity bill", description: "Pay online before the due date to avoid late fees." },
      fr: { title: "Payer la facture d'électricité", description: "Payer en ligne avant l'échéance pour éviter les frais." },
    },
    dueInDays: -4,
    createdDaysAgo: 15,
    status: "done",
    source: "manual",
    category: "perso",
  },
];

/**
 * Realistic sample board for mock mode and the online demo, dated around `today` (YYYY-MM-DD)
 * and written in the visitor's interface language.
 */
export function buildSampleTasks(today: string, locale: Locale): Task[] {
  return SAMPLE_TASKS.map(({ text, dueInDays, createdDaysAgo, ...task }) => {
    const createdAt = `${addDays(today, -createdDaysAgo)}T09:00:00.000Z`;
    return { ...task, ...text[locale], dueDate: addDays(today, dueInDays), createdAt, updatedAt: createdAt };
  });
}
