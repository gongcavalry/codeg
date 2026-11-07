import { describe, expect, it } from "vitest"
import { userPromptNeighbors } from "./user-prompt-rail"

describe("userPromptNeighbors", () => {
  const users = [2, 10, 40]

  it("steps to the user turn above and below the row on screen", () => {
    expect(userPromptNeighbors(users, 25)).toEqual({
      previous: 10,
      next: 40,
    })
  })

  it("leaves the user turn it is already sitting on", () => {
    expect(userPromptNeighbors(users, 10)).toEqual({
      previous: 2,
      next: 40,
    })
  })

  it("has nowhere up from the first prompt and nowhere down from the last", () => {
    expect(userPromptNeighbors(users, 0)).toEqual({
      previous: null,
      next: 2,
    })
    expect(userPromptNeighbors(users, 40)).toEqual({
      previous: 10,
      next: null,
    })
    expect(userPromptNeighbors(users, 80)).toEqual({
      previous: 40,
      next: null,
    })
  })
})