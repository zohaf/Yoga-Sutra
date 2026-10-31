"use client";

import { useState } from "react";
import type { FC } from "react";
import type { Chapter } from "../../lib/contentful";
import { Accordion } from "../accordion";
import { Verse } from "../verse";

export const ChapterList: FC<{ chapters: Chapter[] }> = ({ chapters }) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  return chapters.map((chapter, index) => (
    <Accordion key={chapter.id}>
      <Accordion.Header
        onClick={() => {
          if (clickedIndex === index) {
            setClickedIndex(null);
          } else {
            setClickedIndex(index);
          }
        }}
        title={chapter.title ?? ""}
        expanded={clickedIndex === index}
        controls={`chapter-${chapter.id}`}
      />
      {clickedIndex === index && (
        <Accordion.Body id={`chapter-${chapter.id}`}>
          <div className="h-[2px] bg-white mb-8" />
          {chapter.verses.map((verse) => (
            <Verse key={verse.id} verse={verse} />
          ))}
        </Accordion.Body>
      )}
    </Accordion>
  ));
};
