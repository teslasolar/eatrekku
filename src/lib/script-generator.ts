import { Panel, MangaPage, Dialogue, EmotionMarker, Footnote, ReadingDirection } from "@/types/manga";
import { getTemplate } from "./templates";
import { getSfxForContext } from "@/data/sfx";
import { getEraPack, eraPacks } from "@/data/era-packs";
import type { HistoricalEvent, EraPack } from "@/types/manga";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

interface ScriptInput {
  eraId: string;
  eventId: string;
  readingDirection?: ReadingDirection;
}

interface FreeformInput {
  prompt: string;
  readingDirection?: ReadingDirection;
}

function pickEmotions(description: string): EmotionMarker[] {
  const d = description.toLowerCase();
  const markers: EmotionMarker[] = [];

  if (d.includes("rage") || d.includes("anger") || d.includes("fury")) markers.push("anger_vein");
  if (d.includes("fear") || d.includes("anxious") || d.includes("nervous")) markers.push("sweat_drop");
  if (d.includes("beauti") || d.includes("awe") || d.includes("magnificent")) markers.push("sparkle");
  if (d.includes("confus") || d.includes("dizz")) markers.push("spiral_eyes");
  if (d.includes("passion") || d.includes("determin") || d.includes("burning")) markers.push("flame_aura");
  if (d.includes("shock") || d.includes("frozen") || d.includes("cold")) markers.push("freeze_lines");
  if (d.includes("embarrass") || d.includes("blush")) markers.push("blush_lines");
  if (d.includes("realiz") || d.includes("understand") || d.includes("epiphany")) markers.push("lightning_bg");
  if (d.includes("romance") || d.includes("love") || d.includes("beauty")) markers.push("petal_scatter");
  if (d.includes("terror") || d.includes("horror") || d.includes("ghost")) markers.push("ghost_escape");

  return markers;
}

function generatePanelsForEvent(event: HistoricalEvent, era: EraPack): { panels: Panel[]; footnotes: Footnote[] } {
  const panels: Panel[] = [];
  const footnotes: Footnote[] = [];

  const templateName = event.suggestedTemplate || "buildup";
  const template = getTemplate(templateName);

  if (templateName === "splash") {
    panels.push({
      type: "splash",
      description: event.dramaticPeak,
      dialogue: [
        {
          character: "Narrator",
          text: `${event.name}, ${event.year}`,
          bubbleType: "narration",
        },
      ],
      sfx: getSfxForContext(event.description).slice(0, 2),
      emotionMarkers: pickEmotions(event.dramaticPeak),
      characters: event.characters,
    });
    footnotes.push({ panelIndex: 0, text: event.description });
    return { panels, footnotes };
  }

  // Panel 1: Establishing shot
  panels.push({
    type: "establishing",
    description: `${event.name} — ${event.year}. ${event.description.split(".")[0]}.`,
    dialogue: [
      {
        character: "Narrator",
        text: `${event.year} — ${event.name}`,
        bubbleType: "narration",
      },
    ],
    sfx: [],
    emotionMarkers: [],
    characters: event.characters.slice(0, 2),
  });
  footnotes.push({ panelIndex: 0, text: event.description });

  if (templateName === "buildup") {
    // Panel 2-3: Character introduction
    const chars = event.characters;
    panels.push({
      type: "closeup",
      description: `${chars[0] || "The protagonist"} surveys the scene with determination`,
      dialogue: chars[0]
        ? [{ character: chars[0], text: "The time has come...", bubbleType: "normal" }]
        : [],
      sfx: getSfxForContext("silence tension").slice(0, 1),
      emotionMarkers: ["flame_aura"],
      characters: [chars[0] || "Unknown"],
    });
    panels.push({
      type: "closeup",
      description: chars[1]
        ? `${chars[1]} responds with visible tension`
        : "The crowd watches with bated breath",
      dialogue: chars[1]
        ? [{ character: chars[1], text: "So it begins.", bubbleType: "whisper" }]
        : [{ character: "Crowd", text: "...", bubbleType: "whisper" }],
      sfx: getSfxForContext("crowd murmur").slice(0, 1),
      emotionMarkers: ["sweat_drop"],
      characters: [chars[1] || "Crowd"],
    });
    // Panel 4: Emotional hook
    panels.push({
      type: "closeup",
      description: event.dramaticPeak,
      dialogue: [
        {
          character: chars[0] || "Narrator",
          text: event.dramaticPeak.split("—")[0]?.trim() || event.dramaticPeak,
          bubbleType: "shouting",
        },
      ],
      sfx: getSfxForContext(event.dramaticPeak).slice(0, 2),
      emotionMarkers: pickEmotions(event.dramaticPeak),
      characters: event.characters,
    });
  } else if (templateName === "action") {
    // 6-panel action layout
    panels.push({
      type: "action",
      description: `Motion erupts — ${event.dramaticPeak.split("—")[0]?.trim() || "the action begins"}`,
      dialogue: [],
      sfx: getSfxForContext(event.description).slice(0, 2),
      emotionMarkers: [],
      characters: event.characters.slice(0, 2),
    });
    panels.push({
      type: "reaction",
      description: `A moment of shock as events unfold`,
      dialogue: [
        {
          character: event.characters[0] || "Warrior",
          text: "...!",
          bubbleType: "trembling",
        },
      ],
      sfx: getSfxForContext("silence").slice(0, 1),
      emotionMarkers: ["freeze_lines"],
      characters: [event.characters[0] || "Warrior"],
    });
    // Wide impact
    panels.push({
      type: "bleed",
      description: event.dramaticPeak,
      dialogue: [
        {
          character: "Narrator",
          text: event.dramaticPeak,
          bubbleType: "narration",
        },
      ],
      sfx: getSfxForContext(event.dramaticPeak).slice(0, 3),
      emotionMarkers: pickEmotions(event.dramaticPeak),
      characters: event.characters,
    });
    // Reactions
    panels.push({
      type: "reaction",
      description: `${event.characters[0] || "The victor"} stands amid the aftermath`,
      dialogue: [
        {
          character: event.characters[0] || "Victor",
          text: "It is done.",
          bubbleType: "trembling",
        },
      ],
      sfx: [],
      emotionMarkers: ["sweat_drop"],
      characters: [event.characters[0] || "Victor"],
    });
    panels.push({
      type: "reaction",
      description: `The weight of what has happened settles over everyone`,
      dialogue: [
        {
          character: "Narrator",
          text: `And so, ${event.name} changed history forever.`,
          bubbleType: "narration",
        },
      ],
      sfx: getSfxForContext("silence").slice(0, 1),
      emotionMarkers: [],
      characters: event.characters.slice(0, 2),
    });
    footnotes.push({ panelIndex: 3, text: event.dramaticPeak });
  } else if (templateName === "revelation") {
    // 5-panel revelation
    panels.push({
      type: "closeup",
      description: `Details emerge — the pieces fall into place`,
      dialogue: [
        {
          character: event.characters[0] || "Speaker",
          text: "Listen carefully...",
          bubbleType: "normal",
        },
      ],
      sfx: [],
      emotionMarkers: [],
      characters: [event.characters[0] || "Speaker"],
    });
    panels.push({
      type: "small_inset",
      description: `A telling detail — a hand gesture, an exchanged glance`,
      dialogue: [],
      sfx: getSfxForContext("silence tension").slice(0, 1),
      emotionMarkers: ["sweat_drop"],
      characters: event.characters.slice(0, 1),
    });
    panels.push({
      type: "closeup",
      description: `Eyes widen — the realization hits`,
      dialogue: [
        {
          character: event.characters[0] || "Witness",
          text: "Could it be...?!",
          bubbleType: "trembling",
        },
      ],
      sfx: getSfxForContext("revelation shock").slice(0, 1),
      emotionMarkers: ["lightning_bg"],
      characters: [event.characters[0] || "Witness"],
    });
    // Splash reveal
    panels.push({
      type: "bleed",
      description: event.dramaticPeak,
      dialogue: [
        {
          character: "Narrator",
          text: event.dramaticPeak,
          bubbleType: "narration",
        },
      ],
      sfx: getSfxForContext(event.dramaticPeak).slice(0, 2),
      emotionMarkers: pickEmotions(event.dramaticPeak),
      characters: event.characters,
    });
    footnotes.push({ panelIndex: 4, text: event.description });
  }

  return { panels, footnotes };
}

export function generateMangaScript(input: ScriptInput): MangaPage {
  const era = getEraPack(input.eraId);
  if (!era) throw new Error(`Era pack not found: ${input.eraId}`);

  const event = era.events.find((e) => e.id === input.eventId);
  if (!event) throw new Error(`Event not found: ${input.eventId}`);

  const templateName = event.suggestedTemplate || "buildup";
  const template = getTemplate(templateName);

  const { panels, footnotes } = generatePanelsForEvent(event, era);

  return {
    id: generateId(),
    title: event.name,
    era: era.name,
    event: event.id,
    year: event.year,
    panels,
    template,
    readingDirection: input.readingDirection || "rtl",
    footnotes,
    style: era.style,
  };
}

export function generateFromFreeform(input: FreeformInput): MangaPage {
  // Match against known events first
  const promptLower = input.prompt.toLowerCase();

  for (const era of eraPacks) {
    for (const event of era.events) {
      const eventWords = event.name.toLowerCase().split(/\s+/);
      const matchCount = eventWords.filter((w) => promptLower.includes(w)).length;
      if (matchCount >= 2 || promptLower.includes(event.id.replace("-", " "))) {
        return generateMangaScript({
          eraId: era.id,
          eventId: event.id,
          readingDirection: input.readingDirection,
        });
      }
    }
    // Check character names
    for (const char of era.characters) {
      if (promptLower.includes(char.toLowerCase())) {
        // Find the first event featuring this character
        const event = era.events.find((e) =>
          e.characters.some((c) => c.toLowerCase() === char.toLowerCase())
        );
        if (event) {
          return generateMangaScript({
            eraId: era.id,
            eventId: event.id,
            readingDirection: input.readingDirection,
          });
        }
      }
    }
  }

  // Fallback: generate a generic page
  const defaultEra = eraPacks[0];
  const defaultEvent = defaultEra.events[0];
  return generateMangaScript({
    eraId: defaultEra.id,
    eventId: defaultEvent.id,
    readingDirection: input.readingDirection,
  });
}
