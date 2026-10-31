import { ChapterList } from "../components/chapterList";
import { Container } from "../components/container";
import { getChapters } from "../lib/contentful";

export default async function Home() {
  const chapters = await getChapters();

  return (
    <Container>
      <h1 className="visually-hidden">Yoga Sutra of Patanjali</h1>
      <ChapterList chapters={chapters} />
    </Container>
  );
}
