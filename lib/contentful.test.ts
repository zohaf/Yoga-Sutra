import { describe, expect, it } from "vitest";
import { parseGlossaryEntry } from "./contentful";

describe("parseGlossaryEntry", () => {
  it("splits term and meaning and trims both", () => {
    expect(
      parseGlossaryEntry("drastuh = seer, witness, pure awareness "),
    ).toEqual({
      term: "drastuh",
      meaning: "seer, witness, pure awareness",
    });
  });

  it("splits on the first = only", () => {
    expect(parseGlossaryEntry("a = b = c")).toEqual({
      term: "a",
      meaning: "b = c",
    });
  });

  it("keeps an entry without = as a term with no meaning", () => {
    expect(parseGlossaryEntry(" citta ")).toEqual({
      term: "citta",
      meaning: "",
    });
  });
});
