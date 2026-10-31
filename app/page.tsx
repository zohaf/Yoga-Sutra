import { ChapterList } from "../components/chapterList";
import { Container } from "../components/container";
import { getChapters } from "../lib/contentful";

export default async function Home() {
  const chapters = await getChapters();

  return (
    <Container>
      <ChapterList chapters={chapters} />
    </Container>
  );
}
