import { describe, expect, it } from "vitest"

import {
  folderNameMark,
  folderNameMarkColors,
  hasChineseFolderMark,
} from "./folder-name-mark"

// Mirrors dsh-plugins/bc-session-badges wsAbbr() cases.
describe("folderNameMark", () => {
  it("takes the first two chars of a Chinese display name", () => {
    expect(folderNameMark("工具")).toBe("工具")
    expect(folderNameMark("电商")).toBe("电商")
  })

  it("strips the BC prefix and 工作区 suffix like DSH", () => {
    expect(folderNameMark("BC工具工作区")).toBe("工具")
    expect(folderNameMark("bc电商")).toBe("电商")
  })

  it("keeps a bare 'bc' as BC", () => {
    expect(folderNameMark("bc")).toBe("BC")
    expect(folderNameMark("BC")).toBe("BC")
  })

  it("returns null for empty input", () => {
    expect(folderNameMark(null)).toBeNull()
    expect(folderNameMark("  ")).toBeNull()
  })
})

describe("folderNameMarkColors", () => {
  it("uses the DSH measured palette", () => {
    expect(folderNameMarkColors("工具")).toEqual([
      "rgb(19, 51, 83)",
      "rgb(191, 222, 252)",
    ])
  })

  it("falls back to neutral grey for unknown labels", () => {
    expect(folderNameMarkColors("别的")).toEqual([
      "rgb(51, 51, 51)",
      "rgb(222, 222, 222)",
    ])
  })
})

describe("hasChineseFolderMark", () => {
  it("accepts two or more CJK chars", () => {
    expect(hasChineseFolderMark("工具")).toBe(true)
    expect(hasChineseFolderMark("信息猎手")).toBe(true)
  })

  it("rejects latin-only or single-CJK names", () => {
    expect(hasChineseFolderMark("bc-tools")).toBe(false)
    expect(hasChineseFolderMark("工")).toBe(false)
    expect(hasChineseFolderMark("")).toBe(false)
    expect(hasChineseFolderMark(null)).toBe(false)
  })
})
