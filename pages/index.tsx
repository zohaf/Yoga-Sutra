import { NextPage } from "next";
import { useState } from "react";
import { useContentful } from "react-contentful";
import type { HookResponse } from "react-contentful";
import { Accordion } from "../components/accordion";
import { Container } from "../components/container";
import { VerseSingle } from "../components/verseSingle";

type Verse = {
  fields: {
    verseNumber: number;
    englishVerse: string;
    sanskritVerse: string;
    sanskritWords: string[];
  };
};

type Chapter = {
  fields: {
    chapterNumber: number;
    chapterTitle: string;
    verses: Verse[];
  };
};

type BookData = {
  items: Chapter[];
};

const Home: NextPage = () => {
  let { data: contentfulData }: HookResponse = useContentful({
    contentType: "chapter",
    query: {},
  });

  const book = contentfulData as BookData;

  const [clickedIndex, setClickedIndex] = useState(null);

  return (
    <Container>
      {book?.items?.map((chapter, index) => (
        <Accordion key={index}>
          <Accordion.Header
            onClick={() => {
              if (clickedIndex === index) {
                setClickedIndex(null);
              } else {
                setClickedIndex(index);
              }
            }}
            title={chapter.fields.chapterTitle}
          />
          {clickedIndex === index && (
            <Accordion.Body>
              <div className="h-[2px] bg-white mb-8" />
              {chapter.fields.verses?.map((verse, index) => (
                <VerseSingle
                  key={index}
                  verseNumber={verse.fields.verseNumber}
                  verseEnglish={verse.fields.englishVerse}
                  verseSanskrit={verse.fields.sanskritVerse}
                  sanskritWords={verse.fields.sanskritWords}
                />
              ))}
            </Accordion.Body>
          )}
        </Accordion>
      ))}
    </Container>
  );
};

export default Home;
