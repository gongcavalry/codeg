/**
 * DSH-style folder chip — a direct port of dsh-plugins/bc-session-badges
 * `wsAbbr()` + `WS_BADGE_COLORS` (2026-11-07). The abbreviation is derived
 * from the folder's DISPLAY NAME, exactly like DSH reads the workspace title:
 * strip the "BC" house prefix and a trailing "工作区", take the first two
 * chars ("工具工作区" -> "工具"). Folders are expected to carry Chinese
 * display names (工具 / 电商 / 个人 …), renamed in the app like DSH
 * workspaces are; the mapping lives in the DATA, not here.
 */
export function folderNameMark(name: string | null | undefined): string | null {
  if (!name) return null
  const t0 = String(name).trim()
  if (!t0) return null
  if (/^bc$/i.test(t0)) return "BC"
  const t = t0.replace(/^bc/i, "").replace(/工作区$/, "").trim()
  if (!t) return "BC"
  return Array.from(t).slice(0, 2).join("")
}

/**
 * DSH WS_BADGE_COLORS measured values: [fg, bg] = deep text on light tint.
 * Unknown labels get the neutral 杂务 grey, same as DSH's fallback tone.
 */
const FOLDER_MARK_COLORS: Record<string, [string, string]> = {
  工具: ["rgb(19, 51, 83)", "rgb(191, 222, 252)"],
  电商: ["rgb(83, 51, 19)", "rgb(252, 222, 191)"],
  个人: ["rgb(51, 19, 83)", "rgb(222, 191, 252)"],
  公司: ["rgb(83, 19, 19)", "rgb(252, 191, 191)"],
  共享: ["rgb(51, 83, 19)", "rgb(222, 252, 191)"],
  知识: ["rgb(83, 51, 19)", "rgb(252, 222, 191)"],
  杂务: ["rgb(51, 51, 51)", "rgb(222, 222, 222)"],
  BC: ["rgb(19, 51, 83)", "rgb(191, 222, 252)"],
}

const FALLBACK: [string, string] = ["rgb(51, 51, 51)", "rgb(222, 222, 222)"]

export function folderNameMarkColors(mark: string): [string, string] {
  return FOLDER_MARK_COLORS[mark] ?? FALLBACK
}

const CJK = /[\u3400-\u4DBF\u4E00-\u9FFF]/g

/**
 * Gate for the folder-creation flow: the display alias must carry at least
 * two CJK chars, so the sidebar chip can never come out latin. "至少两个
 * 汉字" is the house rule (老板 2026-11-07).
 */
export function hasChineseFolderMark(name: string | null | undefined): boolean {
  if (!name) return false
  return (name.match(CJK)?.length ?? 0) >= 2
}
