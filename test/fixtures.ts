import type { Chapter } from "../lib/contentful";

export const chapters: Chapter[] = [
  {
    id: "c1",
    chapterNumber: 1,
    title: "Integration",
    verses: [
      {
        id: "c1v1",
        verseNumber: 1,
        english: "Now, the teachings of yoga.",
        sanskrit: "atha yogānuśāsanam",
        sanskritWords: ["atha = now", "anuśāsanam = teaching, exposition"],
      },
      {
        id: "c1v2",
        verseNumber: 2,
        english: "Yoga is to still the patterning of consciousness.",
        sanskrit: null,
        sanskritWords: [],
      },
    ],
  },
  {
    id: "c2",
    chapterNumber: 2,
    title: "The Path To Realization",
    verses: [
      {
        id: "c2v1",
        verseNumber: 1,
        english: "Second chapter, first verse.",
        sanskrit: null,
        sanskritWords: [],
      },
    ],
  },
];
