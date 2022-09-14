import React from "react";
import { VerseEnglish } from "../verseEnglish";
import { VerseSanskrit } from "../verseSanskrit";

export const VerseOverall = () => (
  <div className="flex gap-10">
    <VerseEnglish />
    <VerseSanskrit />
  </div>
);
