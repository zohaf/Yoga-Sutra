import { createClient } from "contentful";
import type { Entry, EntryFieldTypes, EntrySkeletonType } from "contentful";

// Contentful content model (all fields are optional in the space).
type VerseSkeleton = EntrySkeletonType<
  {
    verseTitle?: EntryFieldTypes.Symbol;
    verseNumber?: EntryFieldTypes.Integer;
    englishVerse?: EntryFieldTypes.Text;
    sanskritVerse?: EntryFieldTypes.Symbol;
    sanskritWords?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  },
  "verse"
>;

type ChapterSkeleton = EntrySkeletonType<
  {
    chapterNumber?: EntryFieldTypes.Integer;
    chapterTitle?: EntryFieldTypes.Symbol;
    verses?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<VerseSkeleton>>;
  },
  "chapter"
>;

// Plain, serializable shapes passed to pages as props.
export type Verse = {
  id: string;
  verseNumber: number | null;
  english: string | null;
  sanskrit: string | null;
  sanskritWords: string[];
};

export type Chapter = {
  id: string;
  chapterNumber: number | null;
  title: string | null;
  verses: Verse[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

const byNumber = (a: number | null, b: number | null) =>
  (a ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER);

function toVerse(
  entry: Entry<VerseSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">,
): Verse {
  return {
    id: entry.sys.id,
    verseNumber: entry.fields.verseNumber ?? null,
    english: entry.fields.englishVerse ?? null,
    sanskrit: entry.fields.sanskritVerse ?? null,
    sanskritWords: entry.fields.sanskritWords ?? [],
  };
}

/** Fetches all chapters with their verses, ordered by chapter and verse number. */
export async function getChapters(): Promise<Chapter[]> {
  const client = createClient({
    space: requireEnv("CONTENTFUL_SPACE_ID"),
    accessToken: requireEnv("CONTENTFUL_ACCESS_TOKEN"),
  });

  const response =
    await client.withoutUnresolvableLinks.getEntries<ChapterSkeleton>({
      content_type: "chapter",
      include: 2,
    });

  return response.items
    .map((entry) => ({
      id: entry.sys.id,
      chapterNumber: entry.fields.chapterNumber ?? null,
      title: entry.fields.chapterTitle ?? null,
      verses: (entry.fields.verses ?? [])
        .filter((verse) => verse !== undefined)
        .map(toVerse)
        .sort((a, b) => byNumber(a.verseNumber, b.verseNumber)),
    }))
    .sort((a, b) => byNumber(a.chapterNumber, b.chapterNumber));
}
