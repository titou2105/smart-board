import type { AssistantTurn, TaskAssistant } from "@/core/assistant";
import { findMissingFields, type RequiredField, type TaskDraft } from "@/core/task";

// Questions asked for each missing field, in French (Thomas's language).
const QUESTIONS: Record<RequiredField, string> = {
  title: "Que dois-tu faire, en quelques mots ?",
  description: "Peux-tu préciser un peu (contexte, détails utiles) ?",
  dueDate: "Pour quand ? (format AAAA-MM-JJ)",
};

/**
 * Fake assistant with no AI: it fills the first missing field with the user's
 * message, then asks for the next one. Enough to build and test the UI for free.
 */
export const mockAssistant: TaskAssistant = {
  async reply(message: string, draft: TaskDraft): Promise<AssistantTurn> {
    const answer = message.trim();
    const [firstMissing] = findMissingFields(draft);
    const updated: TaskDraft = firstMissing && answer ? { ...draft, [firstMissing]: answer } : draft;

    const missingFields = findMissingFields(updated);
    return {
      draft: updated,
      missingFields,
      question: missingFields.length > 0 ? QUESTIONS[missingFields[0]] : null,
    };
  },
};
