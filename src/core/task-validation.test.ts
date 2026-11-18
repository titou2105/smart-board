import { describe, expect, it } from "vitest";
import { hasFieldErrors, validateTaskFields } from "./task-validation";

describe("validateTaskFields", () => {
  it("accepts a complete task", () => {
    const errors = validateTaskFields({ title: "Appeler", description: "Le plombier", dueDate: "2026-11-20" });
    expect(errors).toEqual({});
    expect(hasFieldErrors(errors)).toBe(false);
  });

  it("flags every empty field, blanks included", () => {
    expect(validateTaskFields({ title: "  ", description: "", dueDate: "" })).toEqual({
      title: "required",
      description: "required",
      dueDate: "required",
    });
  });

  it("tells an invalid date apart from a missing one", () => {
    expect(validateTaskFields({ title: "a", description: "b", dueDate: "vendredi" })).toEqual({ dueDate: "invalidDate" });
    expect(validateTaskFields({ title: "a", description: "b", dueDate: "2026-02-30" })).toEqual({ dueDate: "invalidDate" });
  });
});
