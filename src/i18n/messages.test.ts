import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";

/** Flattens {"Home": {"title": "…"}} into ["Home.title"], to compare dictionaries key by key. */
function keysOf(dictionary: object, prefix = ""): string[] {
  return Object.entries(dictionary).flatMap(([key, value]) =>
    typeof value === "object" && value !== null ? keysOf(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );
}

describe("translations", () => {
  it("have exactly the same keys in English and French", () => {
    expect(keysOf(fr).sort()).toEqual(keysOf(en).sort());
  });

  it("have no empty text", () => {
    for (const dictionary of [en, fr]) {
      const flat = JSON.stringify(dictionary);
      expect(flat).not.toContain('""');
    }
  });
});
