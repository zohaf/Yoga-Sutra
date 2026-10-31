import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Verse, referenceLabels, toRoman } from ".";
import { chapters } from "../../test/fixtures";

const full = chapters[0].verses[0];
const englishOnly = chapters[0].verses[1];

describe("Verse", () => {
  it("is an article named by its reference heading", () => {
    render(<Verse verse={full} />);
    const article = screen.getByRole("article", { name: "Chapter 1, verse 1" });
    expect(
      within(article).getByRole("heading", {
        level: 3,
        name: "Chapter 1, verse 1",
      }),
    ).toBeInTheDocument();
    expect(within(article).getByText("I.1")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("marks the Sanskrit and glossary terms as IAST Sanskrit", () => {
    render(<Verse verse={full} />);
    expect(screen.getByText("atha yogānuśāsanam")).toHaveAttribute(
      "lang",
      "sa-Latn",
    );
    const terms = screen.getAllByRole("term");
    expect(terms.map((t) => t.getAttribute("lang"))).toEqual([
      "sa-Latn",
      "sa-Latn",
    ]);
    expect(screen.getAllByRole("definition").map((d) => d.textContent)).toEqual(
      ["now", "teaching, exposition"],
    );
  });

  it("orders English first by default and Sanskrit first on request", () => {
    const { rerender } = render(<Verse verse={full} />);
    const order = () => {
      const text = screen.getByRole("article").textContent ?? "";
      return (
        text.indexOf("Now, the teachings") < text.indexOf("atha yogānuśāsanam")
      );
    };
    expect(order()).toBe(true);
    rerender(<Verse verse={full} layout="sanskrit-first" />);
    expect(order()).toBe(false);
  });

  it("renders no Sanskrit block or glossary when the data has none", () => {
    render(<Verse verse={englishOnly} />);
    expect(screen.queryByRole("term")).toBeNull();
    expect(document.querySelector('[lang="sa-Latn"]')).toBeNull();
  });

  it("shows a placeholder when the English is missing", () => {
    render(<Verse verse={{ ...englishOnly, english: null }} />);
    expect(screen.getByText("Translation not added yet.")).toBeInTheDocument();
  });
});

describe("referenceLabels", () => {
  it("builds visible and spoken labels", () => {
    expect(referenceLabels({ chapter: 3, verse: 16 })).toEqual({
      visible: "III.16",
      spoken: "Chapter 3, verse 16",
    });
  });

  it("omits a missing chapter", () => {
    expect(referenceLabels({ chapter: null, verse: 2 })).toEqual({
      visible: "2",
      spoken: "verse 2",
    });
  });

  it("converts chapter numbers to Roman numerals", () => {
    expect([1, 2, 3, 4, 9, 14].map(toRoman)).toEqual([
      "I",
      "II",
      "III",
      "IV",
      "IX",
      "XIV",
    ]);
  });
});
