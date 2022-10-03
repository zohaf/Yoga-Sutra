import type { FC } from "react";

type VerseProps = {
  key: number;
  verseNumber: number;
  verseEnglish: string;
  verseSanskrit: string;
  sanskritWords?: string[];
};

export const VerseSingle: FC<VerseProps> = ({
  key,
  verseNumber,
  verseEnglish,
  verseSanskrit,
  sanskritWords,
}) => (
  <div key={key} className="flex flex-col sm:flex-row gap-4 md:gap-10 mb-10">
    <div className="flex justify-start">
      <h1 className="w-8 font-bold">I. {verseNumber}</h1>
      <h1 className="sm:min-w-[480px] font-bold">{verseEnglish}</h1>
    </div>
    <div className="flex flex-col gap-4 sm:min-w-[240px]">
      <h1 className="font-bold">{verseSanskrit}</h1>
      <ol className="font-extralight">
        {sanskritWords?.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ol>
    </div>
  </div>
);
