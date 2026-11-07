/**
 * Two-letter model chip for a sidebar row.
 *
 * Names and the four hues are the ones DSH 8900 painted in front of a
 * session title (measured off the 1.0 page, then copied into
 * `bc-session-badges`): DS red, ST orange, GP/LA purple, GK/GL green.
 * Unknown labels rotate through that same four-color set.
 *
 * Kimi K3 is the exception the sidebar has to spell out. 8900 folded every
 * Kimi into `KM`, which hides the controller. `kimi-k3` is `K3`, and it
 * takes the blue pair from that same palette so it does not sit on DS red.
 */

const BADGE_COLORS: Record<string, readonly [string, string]> = {
  DS: ["rgb(83, 19, 19)", "rgb(252, 191, 191)"],
  ST: ["rgb(83, 51, 19)", "rgb(252, 222, 191)"],
  GP: ["rgb(51, 19, 83)", "rgb(222, 191, 252)"],
  LA: ["rgb(51, 19, 83)", "rgb(222, 191, 252)"],
  GK: ["rgb(51, 83, 19)", "rgb(222, 252, 191)"],
  GL: ["rgb(51, 83, 19)", "rgb(222, 252, 191)"],
  U2: ["rgb(51, 83, 19)", "rgb(222, 252, 191)"],
  K3: ["rgb(19, 51, 83)", "rgb(191, 222, 252)"],
}

const FALLBACK: readonly (readonly [string, string])[] = [
  ["rgb(83, 19, 19)", "rgb(252, 191, 191)"],
  ["rgb(83, 51, 19)", "rgb(252, 222, 191)"],
  ["rgb(51, 19, 83)", "rgb(222, 191, 252)"],
  ["rgb(51, 83, 19)", "rgb(222, 252, 191)"],
]

/** Deep text, light background. Empty label → no chip. */
export function sessionModelMarkColors(
  label: string
): readonly [string, string] | null {
  if (!label) return null
  const known = BADGE_COLORS[label]
  if (known) return known
  let hash = 0
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) >>> 0
  }
  return FALLBACK[hash % FALLBACK.length]
}

/**
 * Family mark for a stored model id. Empty when the row has no model.
 * Order follows 8900's `modelAbbr`, with `kimi-k3` pulled out in front of
 * the generic Kimi rule.
 */
export function sessionModelMark(model: string | null | undefined): string {
  const m = String(model ?? "")
    .trim()
    .toLowerCase()
  if (!m) return ""
  if (m.includes("kimi-k3") || m.includes("kimi k3")) return "K3"
  if (m.includes("deepseek") || m.startsWith("ds4")) return "DS"
  if (m.includes("gpt")) return "GP"
  if (m.includes("grok")) return "GK"
  if (m.includes("glm")) return "GL"
  if (m.includes("gemini")) return "GM"
  if (m.includes("step")) return "ST"
  if (m.includes("longcat")) return "LC"
  if (m.includes("qwen")) return "QW"
  if (m.includes("kimi")) return "KM"
  if (m.includes("claude")) return "CL"
  if (m.includes("llama")) return "LL"
  return m.replace(/[^a-z0-9]/g, "").slice(0, 2).toUpperCase()
}
