import { describe, expect, it } from "vitest";
import { mockAssistant } from "./mock";

describe("mockAssistant", () => {
  it("collects title, description and due date one question at a time", async () => {
    let turn = await mockAssistant.reply("Appeler le plombier", {});
    expect(turn.missingFields).toEqual(["description", "dueDate"]);
    expect(turn.question).not.toBeNull();

    turn = await mockAssistant.reply("Fuite sous l'évier", turn.draft);
    expect(turn.missingFields).toEqual(["dueDate"]);

    turn = await mockAssistant.reply("2026-11-20", turn.draft);
    expect(turn.missingFields).toEqual([]);
    expect(turn.question).toBeNull();
    expect(turn.draft).toEqual({
      title: "Appeler le plombier",
      description: "Fuite sous l'évier",
      dueDate: "2026-11-20",
    });
  });

  it("asks again when the date is invalid", async () => {
    const turn = await mockAssistant.reply("vendredi", { title: "a", description: "b" });
    expect(turn.missingFields).toEqual(["dueDate"]);
  });
});
