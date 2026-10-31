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

// Plain, serializable shapes passed to components.
export type GlossaryEntry = {
  term: string;
  meaning: string;
};

export type Verse = {
  id: string;
  reference: { chapter: number | null; verse: number | null };
  english: string | null;
  /** IAST transliteration. */
  sanskrit: string | null;
  glossary: GlossaryEntry[];
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

const textOrNull = (value: string | undefined) => value?.trim() || null;

/** Splits a Contentful glossary string such as "atha = now" into term and meaning. */
export function parseGlossaryEntry(entry: string): GlossaryEntry {
  const separator = entry.indexOf("=");
  if (separator === -1) {
    return { term: entry.trim(), meaning: "" };
  }
  return {
    term: entry.slice(0, separator).trim(),
    meaning: entry.slice(separator + 1).trim(),
  };
}

function toVerse(
  entry: Entry<VerseSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">,
  chapter: number | null,
): Verse {
  return {
    id: entry.sys.id,
    reference: { chapter, verse: entry.fields.verseNumber ?? null },
    english: textOrNull(entry.fields.englishVerse),
    sanskrit: textOrNull(entry.fields.sanskritVerse),
    glossary: (entry.fields.sanskritWords ?? [])
      .map(parseGlossaryEntry)
      .filter((item) => item.term !== ""),
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
    .map((entry) => {
      const chapterNumber = entry.fields.chapterNumber ?? null;
      return {
        id: entry.sys.id,
        chapterNumber,
        title: entry.fields.chapterTitle ?? null,
        verses: (entry.fields.verses ?? [])
          .filter((verse) => verse !== undefined)
          .map((verse) => toVerse(verse, chapterNumber))
          .sort((a, b) => byNumber(a.reference.verse, b.reference.verse)),
      };
    })
    .sort((a, b) => byNumber(a.chapterNumber, b.chapterNumber));
}
