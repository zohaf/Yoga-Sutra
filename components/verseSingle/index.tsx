import type { FC } from "react";

type VerseProps = {
  chapterNumber: number | null;
  verseNumber: number | null;
  verseEnglish: string | null;
  verseSanskrit: string | null;
  sanskritWords: string[];
};

const ROMAN_NUMERALS = ["I", "II", "III", "IV"];

export const VerseSingle: FC<VerseProps> = ({
  chapterNumber,
  verseNumber,
  verseEnglish,
  verseSanskrit,
  sanskritWords,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 md:gap-10 mb-10">
    <div className="flex justify-start">
      <h1 className="w-16 shrink-0 font-bold">
        {chapterNumber ? ROMAN_NUMERALS[chapterNumber - 1] : ""}. {verseNumber}
      </h1>
      <h1 className="sm:min-w-[480px] font-bold">{verseEnglish}</h1>
    </div>
    <div className="flex flex-col gap-4 sm:min-w-[240px]">
      <h1 className="font-bold">{verseSanskrit}</h1>
      <ol className="font-extralight">
        {sanskritWords.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ol>
    </div>
  </div>
);
