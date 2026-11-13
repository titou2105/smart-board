import { describe, expect, it } from "vitest";
import { findMissingFields, isDraftComplete } from "./task";

describe("findMissingFields", () => {
  it("lists every required field for an empty draft, in asking order", () => {
    expect(findMissingFields({})).toEqual(["title", "description", "dueDate"]);
  });

  it("treats blank strings as missing", () => {
    expect(findMissingFields({ title: "  ", description: "ok", dueDate: "2026-12-01" })).toEqual(["title"]);
  });

  it("rejects a due date that is not YYYY-MM-DD", () => {
    expect(findMissingFields({ title: "a", description: "b", dueDate: "vendredi" })).toEqual(["dueDate"]);
    expect(findMissingFields({ title: "a", description: "b", dueDate: "2026-13-45" })).toEqual(["dueDate"]);
  });

  it("accepts a complete draft", () => {
    expect(isDraftComplete({ title: "a", description: "b", dueDate: "2026-12-01" })).toBe(true);
  });
});
