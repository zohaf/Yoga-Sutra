import type { GetStaticProps, NextPage } from "next";
import { useState } from "react";
import { Accordion } from "../components/accordion";
import { Container } from "../components/container";
import { VerseSingle } from "../components/verseSingle";
import { getChapters } from "../lib/contentful";
import type { Chapter } from "../lib/contentful";

type HomeProps = {
  chapters: Chapter[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => ({
  props: { chapters: await getChapters() },
});

const Home: NextPage<HomeProps> = ({ chapters }) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  return (
    <Container>
      {chapters.map((chapter, index) => (
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
                <VerseSingle
                  key={verse.id}
                  chapterNumber={chapter.chapterNumber}
                  verseNumber={verse.verseNumber}
                  verseEnglish={verse.english}
                  verseSanskrit={verse.sanskrit}
                  sanskritWords={verse.sanskritWords}
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
