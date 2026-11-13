import type { RequiredField, TaskDraft } from "./task";

/**
 * Contract of the assistant that turns a sentence into a complete card.
 * The app only knows this interface; the implementation (mock or Claude)
 * is picked by the LLM_PROVIDER environment variable.
 */
export interface AssistantTurn {
  /** The draft, enriched with what the assistant understood. */
  draft: TaskDraft;
  /** Required fields still missing after this turn. */
  missingFields: RequiredField[];
  /** The next question to ask the user, or null when the draft is complete. */
  question: string | null;
}

export interface TaskAssistant {
  /**
   * Reads the user's message and updates the draft.
   * Asynchronous even for the mock: the real assistant will go through the network.
   */
  reply(message: string, draft: TaskDraft): Promise<AssistantTurn>;
}
