import type { FC, ReactNode } from "react";
import type { Verse as VerseData } from "../../lib/contentful";
import styles from "./Verse.module.css";

export type VerseLayout = "english-first" | "sanskrit-first";

type VerseProps = {
  verse: VerseData;
  /** Which text leads. The DOM order follows the visual order. */
  layout?: VerseLayout;
};

const ROMAN = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
] as const;

export function toRoman(value: number): string {
  let rest = value;
  let result = "";
  for (const [amount, numeral] of ROMAN) {
    while (rest >= amount) {
      result += numeral;
      rest -= amount;
    }
  }
  return result;
}

/** Visible label such as "I.1" and its spoken form "Chapter 1, verse 1". */
export function referenceLabels({ chapter, verse }: VerseData["reference"]) {
  const parts = [chapter ? toRoman(chapter) : null, verse].filter(
    (part) => part !== null,
  );
  const spoken = [
    chapter ? `Chapter ${chapter}` : null,
    verse !== null ? `verse ${verse}` : null,
  ]
    .filter((part) => part !== null)
    .join(", ");
  return { visible: parts.join("."), spoken };
}

export const Verse: FC<VerseProps> = ({ verse, layout = "english-first" }) => {
  const headingId = `verse-${verse.id}`;
  const label = referenceLabels(verse.reference);

  const english = (
    <div className={styles.english}>
      {verse.english ? (
        <p className={styles.translation}>{verse.english}</p>
      ) : (
        <p className={styles.missing}>Translation not added yet.</p>
      )}
    </div>
  );

  const sanskrit: ReactNode =
    verse.sanskrit || verse.glossary.length > 0 ? (
      <div className={styles.sanskrit}>
        {verse.sanskrit && (
          <p className={styles.original} lang="sa-Latn">
            {verse.sanskrit}
          </p>
        )}
        {verse.glossary.length > 0 && (
          <dl className={styles.glossary} aria-label="Word meanings">
            {verse.glossary.map((entry, index) => (
              <div className={styles.entry} key={index}>
                <dt className={styles.term} lang="sa-Latn">
                  {entry.term}
                  <span aria-hidden="true"> =</span>
                </dt>
                <dd className={styles.meaning}>{entry.meaning}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    ) : null;

  return (
    <article
      className={styles.verse}
      data-layout={layout}
      aria-labelledby={headingId}
    >
      <h3 className={styles.reference} id={headingId}>
        <span aria-hidden="true">{label.visible}</span>
        <span className="visually-hidden">{label.spoken}</span>
      </h3>
      {layout === "english-first" ? (
        <>
          {english}
          {sanskrit}
        </>
      ) : (
        <>
          {sanskrit}
          {english}
        </>
      )}
    </article>
  );
};
