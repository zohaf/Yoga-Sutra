import type { FC } from "react";

type VerseProps = {
  key: number;
  verseNumber: string;
  verseEnglish: string;
};

export const VerseSingle: FC<VerseProps> = ({
  key,
  verseNumber,
  verseEnglish,
}) => (
  <div key={key} className="flex justify-between w-full gap-10 ">
    <h1>{verseNumber}</h1>
    <h1>{verseEnglish}</h1>
  </div>
);
