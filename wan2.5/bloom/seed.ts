/**
 * wan2.5/bloom/seed.ts
 *
 * Seed extractor — converts a MangaPage from the root app
 * into a BloomSeed that starts the bloom cascade.
 */

import type { BloomSeed, SeedPanel, SeedDialogue } from "./bloom-types";

/**
 * MangaPage shape (mirrors root src/types/manga.ts without importing
 * across package boundaries — this keeps wan2.5 decoupled)
 */
interface RootMangaPage {
  id: string;
  title: string;
  era: string;
  event: string;
  year: string;
  panels: {
    type: string;
    description: string;
    dialogue: { character: string; text: string; bubbleType: string }[];
    sfx: { japanese: string; romanji: string; meaning: string }[];
    emotionMarkers: string[];
    characters: string[];
    footnote?: string;
  }[];
  style: {
    name: string;
    palette: string[];
    textures: string[];
    motifs: string[];
  };
}

/**
 * Extract a BloomSeed from a root MangaPage object.
 */
export function extractSeed(page: RootMangaPage): BloomSeed {
  const panels: SeedPanel[] = page.panels.map((p, i) => ({
    index: i,
    type: p.type,
    description: p.description,
    dialogue: p.dialogue.map(
      (d): SeedDialogue => ({
        character: d.character,
        text: d.text,
        bubbleType: d.bubbleType,
      })
    ),
    sfx: p.sfx.map((s) => s.japanese),
    emotionMarkers: p.emotionMarkers,
    characters: p.characters,
    footnote: p.footnote,
  }));

  const allCharacters = Array.from(
    new Set(panels.flatMap((p) => p.characters))
  );

  return {
    stage: "seed",
    mangaPageId: page.id,
    title: page.title,
    era: page.era,
    year: page.year,
    panels,
    characters: allCharacters,
    eraStyle: {
      name: page.style.name,
      palette: [...page.style.palette],
      textures: [...page.style.textures],
      motifs: [...page.style.motifs],
    },
  };
}
