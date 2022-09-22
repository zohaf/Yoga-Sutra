import { NextPage } from "next";
import { useState } from "react";
import { Accordion } from "../components/accordion";
import { Container } from "../components/container";
import { VerseSingle } from "../components/verseSingle";
import data from "../data.json";

const Home: NextPage = () => {
  const [clickedIndex, setClickedIndex] = useState(null);

  return (
    <Container>
      {data?.map((chapter, index) => (
        <Accordion key={index}>
          <Accordion.Header
            onClick={() => {
              if (clickedIndex === index) {
                setClickedIndex(null);
              } else {
                setClickedIndex(index);
              }
            }}
            title={chapter.title}
          />
          {clickedIndex === index && (
            <Accordion.Body>
              {chapter.verses?.map((verse, index) => (
                <VerseSingle
                  key={index}
                  verseNumber={verse.verseNumber}
                  verseEnglish={verse.english}
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
