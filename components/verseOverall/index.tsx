import React from "react";
import { VerseEnglish } from "../verseEnglish";
import { VerseSanskrit } from "../verseSanskrit";

export const VerseOverall = () => {
  return (
    <div className="flex gap-10">
      <VerseEnglish />
      <VerseSanskrit />
    </div>
  );
};
