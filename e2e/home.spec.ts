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
  // Closed panels stay in the DOM for the animation but are hidden from AT.
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("opens a chapter and shows its verses", async ({ page }) => {
  const button = chapterButton(page, "Integration");
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  const panel = page.locator(`#${await button.getAttribute("aria-controls")}`);
  await expect(
    panel.getByRole("heading", { level: 3, name: "Chapter 1, verse 1" }),
  ).toBeVisible();
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
  await page.waitForFunction(() => document.getAnimations().length === 0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("opens chapters without a transition", async ({ page }) => {
    const button = chapterButton(page, "Integration");
    const panel = page.locator(
      `#${await button.getAttribute("aria-controls")}`,
    );
    const duration = await panel.evaluate(
      (el) => getComputedStyle(el).transitionDuration,
    );
    expect(duration.split(",").every((d) => parseFloat(d) === 0)).toBe(true);
  });
});

// 640 CSS px is a 1280px window at 200% zoom (WCAG 1.4.4 / 1.4.10).
test.describe("at 640px", () => {
  test.use({ viewport: { width: 640, height: 800 } });

  test("has no horizontal scroll", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1280", "desktop only");
    await chapterButton(page, "The Path To Realization").click();
    await page.waitForFunction(() => document.getAnimations().length === 0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test("has a heading outline: page h1, chapter h2, verse h3", async ({
  page,
}) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(
    CHAPTERS.length,
  );
  await expect(page.getByRole("main")).toHaveCount(1);

  await chapterButton(page, "The Path To Realization").click();
  const verses = page.getByRole("article");
  const count = await verses.count();
  expect(count).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(count);
});

test("marks Sanskrit as IAST", async ({ page }) => {
  await chapterButton(page, "Integration").click();
  const original = page.getByText("atha yogānuśāsanam", { exact: true });
  await expect(original).toHaveAttribute("lang", "sa-Latn");
  const terms = page.getByRole("term");
  expect(await terms.count()).toBeGreaterThan(0);
  for (const term of await terms.all()) {
    await expect(term).toHaveAttribute("lang", "sa-Latn");
  }
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
