import "../styles/globals.css";
import "@fontsource/ibm-plex-sans";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ContentfulClient, ContentfulProvider } from "react-contentful";
import type { ContentfulClientInterface } from "react-contentful";

const contentfulClient: ContentfulClientInterface = new ContentfulClient({
  accessToken: "45SeHrHeuu14ipJVlI64B4ZXPdGodl1B1uDAinU3b-Q",
  space: "tddqef09vvkl",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Yoga Sutra of Patanjali</title>
        <meta name="description" content="yogaSutra" />
        <link rel="icon" href="/circle.svg" />
      </Head>
      <ContentfulProvider client={contentfulClient}>
        <Component {...pageProps} />
      </ContentfulProvider>
    </>
  );
}

export default MyApp;
