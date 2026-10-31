import type { Chapter } from "../lib/contentful";

export const chapters: Chapter[] = [
  {
    id: "c1",
    chapterNumber: 1,
    title: "Integration",
    verses: [
      {
        id: "c1v1",
        reference: { chapter: 1, verse: 1 },
        english: "Now, the teachings of yoga.",
        sanskrit: "atha yogānuśāsanam",
        glossary: [
          { term: "atha", meaning: "now" },
          { term: "anuśāsanam", meaning: "teaching, exposition" },
        ],
      },
      {
        id: "c1v2",
        reference: { chapter: 1, verse: 2 },
        english: "Yoga is to still the patterning of consciousness.",
        sanskrit: null,
        glossary: [],
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
        reference: { chapter: 2, verse: 1 },
        english: "Second chapter, first verse.",
        sanskrit: null,
        glossary: [],
      },
    ],
  },
];
