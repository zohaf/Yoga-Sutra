import type { FC } from "react";

type VerseProps = {
  key: number;
  verseNumber: number;
  verseEnglish: string;
};

export const VerseSingle: FC<VerseProps> = ({
  key,
  verseNumber,
  verseEnglish,
}) => (
  <div key={key} className="flex justify-start w-full gap-10 ">
    <h1 className="m-3">{verseNumber}</h1>
    <h1 className="m-3">{verseEnglish}</h1>
  </div>
);
