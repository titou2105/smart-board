import { addDays } from "@/core/due-groups";
import type { Task } from "@/core/task";

/**
 * One sample task, with dates written as "days from today" so the demo never looks stale:
 * a visitor in March still sees something late, something for today and something for later.
 */
interface SampleTask extends Omit<Task, "dueDate" | "createdAt" | "updatedAt"> {
  dueInDays: number;
  createdDaysAgo: number;
}

const SAMPLE_TASKS: SampleTask[] = [
  {
    id: "t1",
    title: "Appeler le plombier",
    description: "L'évier de la cuisine fuit. Demander un devis et un créneau cette semaine.",
    dueInDays: -2,
    createdDaysAgo: 8,
    status: "todo",
    source: "manual",
    category: "perso",
  },
  {
    id: "t2",
    title: "Envoyer le compte rendu du comité",
    description: "Relire les notes, lister les décisions et les actions, puis l'envoyer à l'équipe.",
    dueInDays: 0,
    createdDaysAgo: 1,
    status: "todo",
    source: "claude-code",
    category: "pro",
  },
  {
    id: "t3",
    title: "Préparer la revue produit T4",
    description: "Slides sur l'avancement de la roadmap et les KPI pour le comité de pilotage.",
    dueInDays: 3,
    createdDaysAgo: 10,
    status: "in_progress",
    source: "manual",
    category: "pro",
  },
  {
    id: "t4",
    title: "Mettre à jour mon CV en anglais",
    description: "L'adapter aux postes de Product Manager au Canada et ajouter les projets perso.",
    dueInDays: 6,
    createdDaysAgo: 12,
    status: "in_progress",
    source: "manual",
    category: "perso",
  },
  {
    id: "t5",
    title: "Renouveler le passeport",
    description: "Prendre rendez-vous en mairie, apporter deux photos et un justificatif de domicile.",
    dueInDays: 21,
    createdDaysAgo: 9,
    status: "todo",
    source: "claude-code",
    category: "perso",
  },
  {
    id: "t6",
    title: "Payer la facture d'électricité",
    description: "Payer en ligne avant l'échéance pour éviter les frais.",
    dueInDays: -4,
    createdDaysAgo: 15,
    status: "done",
    source: "manual",
    category: "perso",
  },
];

/** Realistic sample board for mock mode and the online demo, dated around `today` (YYYY-MM-DD). */
export function buildSampleTasks(today: string): Task[] {
  return SAMPLE_TASKS.map(({ dueInDays, createdDaysAgo, ...task }) => {
    const createdAt = `${addDays(today, -createdDaysAgo)}T09:00:00.000Z`;
    return { ...task, dueDate: addDays(today, dueInDays), createdAt, updatedAt: createdAt };
  });
}
