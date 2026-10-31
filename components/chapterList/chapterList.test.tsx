import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ChapterList } from ".";
import { chapters } from "../../test/fixtures";

describe("ChapterList", () => {
  it("renders every chapter collapsed", () => {
    render(<ChapterList chapters={chapters} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual([
      "Integration",
      "The Path To Realization",
    ]);
    buttons.forEach((b) => expect(b).toHaveAttribute("aria-expanded", "false"));
    expect(screen.queryByText("Now, the teachings of yoga.")).toBeNull();
  });

  it("opens one chapter at a time", async () => {
    const user = userEvent.setup();
    render(<ChapterList chapters={chapters} />);
    const first = screen.getByRole("button", { name: "Integration" });
    const second = screen.getByRole("button", {
      name: "The Path To Realization",
    });

    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(
      document.getElementById(first.getAttribute("aria-controls")!),
    ).not.toBeNull();
    expect(screen.getByText("Now, the teachings of yoga.")).toBeInTheDocument();

    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Now, the teachings of yoga.")).toBeNull();
    expect(
      screen.getByText("Second chapter, first verse."),
    ).toBeInTheDocument();

    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles with the keyboard", async () => {
    const user = userEvent.setup();
    render(<ChapterList chapters={chapters} />);

    await user.tab();
    expect(screen.getByRole("button", { name: "Integration" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Integration" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });
});
