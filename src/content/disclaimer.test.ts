import { describe, expect, it } from "vitest";
import { DISCLAIMER_ZH } from "./disclaimer.js";

describe("disclaimer", () => {
  it("states communication-aid scope without requiring acknowledge state", () => {
    expect(DISCLAIMER_ZH).toContain("中心碑分隊張小熊");
    expect(DISCLAIMER_ZH).toContain("奇怪怎麼說又");
    expect(DISCLAIMER_ZH).toContain("救護現場雙語溝通輔助");
    expect(DISCLAIMER_ZH).toContain("非評估或診斷");
  });
});
