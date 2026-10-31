import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const CHAPTERS = [
  "Integration",
  "The Path To Realization",
  "Extraordinary Powers",
  "Freedom",
];

// WCAG 2.0, 2.1 and 2.2, levels A and AA.
const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const chapterButton = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });

async function expectNoAxeViolations(page: Page) {
  // Let open/close animations finish so axe sees final colours and opacity.
  await page.waitForFunction(() => document.getAnimations().length === 0);
  const results = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  const summary = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.map((n) => n.target.join(" ")),
  }));
  expect(summary).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("lists the four chapters, collapsed", async ({ page }) => {
  for (const name of CHAPTERS) {
    await expect(chapterButton(page, name)).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  }
});

test("opens a chapter and shows its verses", async ({ page }) => {
  const button = chapterButton(page, "Integration");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator(`#${await button.getAttribute("aria-controls")}`);
  await expect(panel.getByText("I. 1", { exact: true })).toBeVisible();
});

test("opens a chapter with the keyboard", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(chapterButton(page, "Integration")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(chapterButton(page, "Integration")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("has no horizontal scroll", async ({ page }) => {
  await chapterButton(page, "The Path To Realization").click();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

// 640 CSS px is a 1280px window at 200% zoom (WCAG 1.4.4 / 1.4.10).
// Known failure: fixed min-widths in VerseSingle and min-w-fit in Container
// overflow by 160px. Remove test.fail() once the verse layout is rebuilt.
test("has no horizontal scroll at 640px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "desktop only");
  test.fail();
  await page.setViewportSize({ width: 640, height: 800 });
  await chapterButton(page, "The Path To Realization").click();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test.describe("axe, WCAG 2.2 AA", () => {
  test("collapsed", async ({ page }) => {
    await expectNoAxeViolations(page);
  });

  for (const name of ["Integration", "The Path To Realization"]) {
    test(`with "${name}" open`, async ({ page }) => {
      await chapterButton(page, name).click();
      await expect(chapterButton(page, name)).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      await expectNoAxeViolations(page);
    });
  }
});
