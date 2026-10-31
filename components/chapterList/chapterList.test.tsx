import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChapterList } from ".";
import { chapters } from "../../test/fixtures";

const panelOf = (button: HTMLElement) =>
  document.getElementById(button.getAttribute("aria-controls") ?? "");

// Closed panels stay in the DOM (so they can animate) but are inert.
const expectOpen = (button: HTMLElement, open: boolean) => {
  expect(button).toHaveAttribute("aria-expanded", String(open));
  const panel = panelOf(button);
  expect(panel).not.toBeNull();
  if (open) {
    expect(panel).not.toHaveAttribute("inert");
  } else {
    expect(panel).toHaveAttribute("inert");
  }
};

describe("ChapterList", () => {
  it("renders every chapter collapsed", () => {
    render(<ChapterList chapters={chapters} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Integration",
      "The Path To Realization",
    ]);
    buttons.forEach((b) => expectOpen(b, false));
  });

  it("opens one chapter at a time", async () => {
    const user = userEvent.setup();
    render(<ChapterList chapters={chapters} />);
    const first = screen.getByRole("button", { name: "Integration" });
    const second = screen.getByRole("button", {
      name: "The Path To Realization",
    });

    await user.click(first);
    expectOpen(first, true);
    expect(panelOf(first)).toHaveTextContent("Now, the teachings of yoga.");

    await user.click(second);
    expectOpen(first, false);
    expectOpen(second, true);
    expect(panelOf(second)).toHaveTextContent("Second chapter, first verse.");

    await user.click(second);
    expectOpen(second, false);
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();
    render(<ChapterList chapters={chapters} />);

    await user.tab();
    const first = screen.getByRole("button", { name: "Integration" });
    expect(first).toHaveFocus();
    await user.keyboard("{Enter}");
    expectOpen(first, true);
  });
});
