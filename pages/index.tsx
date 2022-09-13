import { NextPage } from "next";
import { Container } from "../components/container";
import { SidePanel } from "../components/sidePanel";
import { VerseOverall } from "../components/verseOverall";

const Home: NextPage = () => (
  <div className="flex mt-48">
    <SidePanel>
      <h1>chapter 1</h1>
      <h1>chapter 2</h1>
      <h1>chapter 3</h1>
      <h1>chapter 4</h1>
    </SidePanel>
    <Container>
      <VerseOverall />
    </Container>
    <SidePanel>
      <ul>
        <li>1.1</li>
        <li>1.10</li>
        <li>1.20</li>
        <li>1.30</li>
        <li>1.40</li>
        <li>1.50</li>
      </ul>
    </SidePanel>
  </div>
);

export default Home;
