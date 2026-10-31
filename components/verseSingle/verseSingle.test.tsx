import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerseSingle } from ".";

describe("VerseSingle", () => {
  it("shows the chapter numeral, verse number, English, Sanskrit and glossary", () => {
    render(
      <VerseSingle
        chapterNumber={2}
        verseNumber={3}
        verseEnglish="English text"
        verseSanskrit="sanskrit text"
        sanskritWords={["atha = now", "yoga = union"]}
      />,
    );

    expect(screen.getByText("II. 3")).toBeInTheDocument();
    expect(screen.getByText("English text")).toBeInTheDocument();
    expect(screen.getByText("sanskrit text")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(
      ["atha = now", "yoga = union"],
    );
  });

  it("renders without Sanskrit or glossary", () => {
    render(
      <VerseSingle
        chapterNumber={3}
        verseNumber={1}
        verseEnglish={null}
        verseSanskrit={null}
        sanskritWords={[]}
      />,
    );

    expect(screen.getByText("III. 1")).toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
