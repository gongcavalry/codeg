import { describe, expect, it } from "vitest"
import {
  sessionModelMark,
  sessionModelMarkColors,
} from "./session-model-mark"

describe("sessionModelMark", () => {
  it("uses the 8900 family letters", () => {
    expect(sessionModelMark("grok-4.7-build-fast")).toBe("GK")
    expect(sessionModelMark("deepseek-v4.1-flash")).toBe("DS")
    expect(sessionModelMark("gpt-5.4")).toBe("GP")
    expect(sessionModelMark("glm-5.2")).toBe("GL")
    expect(sessionModelMark("gemini-3-flash")).toBe("GM")
    expect(sessionModelMark("step-5-preview")).toBe("ST")
    expect(sessionModelMark("qwen-flash")).toBe("QW")
    expect(sessionModelMark("kimi-k2.7-code")).toBe("KM")
    expect(sessionModelMark("claude-opus-4.8")).toBe("CL")
  })

  it("spells Kimi K3 as K3, not the CLI and not KM", () => {
    expect(sessionModelMark("kimi-k3")).toBe("K3")
    expect(sessionModelMark("kimi-k3-max")).toBe("K3")
  })

  it("stays blank when the row never recorded a model", () => {
    expect(sessionModelMark(null)).toBe("")
    expect(sessionModelMark("  ")).toBe("")
  })

  it("keeps the 8900 hues, and gives K3 the blue pair", () => {
    expect(sessionModelMarkColors("GK")?.[0]).toBe("rgb(51, 83, 19)")
    expect(sessionModelMarkColors("DS")?.[1]).toBe("rgb(252, 191, 191)")
    expect(sessionModelMarkColors("K3")?.[1]).toBe("rgb(191, 222, 252)")
    expect(sessionModelMarkColors("")).toBeNull()
  })
})
