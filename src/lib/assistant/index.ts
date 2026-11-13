import type { TaskAssistant } from "@/core/assistant";
import { mockAssistant } from "./mock";

/**
 * Picks the assistant from LLM_PROVIDER (mock by default).
 * Server-side only: the future Claude implementation will need a secret API key.
 */
export function getTaskAssistant(): TaskAssistant {
  const provider = process.env.LLM_PROVIDER ?? "mock";
  switch (provider) {
    case "mock":
      return mockAssistant;
    case "claude":
      // Planned in milestone M4 (US-5.1). A clear error beats a silent fallback to mock.
      throw new Error("LLM_PROVIDER=claude n'est pas encore implémenté (voir US-5.1). Utilise LLM_PROVIDER=mock.");
    default:
      throw new Error(`LLM_PROVIDER inconnu : "${provider}". Valeurs possibles : mock, claude.`);
  }
}
