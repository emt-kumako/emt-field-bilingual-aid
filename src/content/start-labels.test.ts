import { describe, expect, it } from "vitest";
import { INFORMANT_OPTIONS } from "./start-labels.js";

describe("INFORMANT_OPTIONS", () => {
  it("labels friend as 朋友(友人) / Friend, not 有人", () => {
    const friend = INFORMANT_OPTIONS.find((o) => o.id === "friend");
    expect(friend?.labels.zh).toBe("朋友(友人)");
    expect(friend?.labels.en).toBe("Friend");
    expect(friend?.labels.zh).not.toBe("有人");
    expect(friend?.labels.en).not.toMatch(/someone/i);
  });
});
