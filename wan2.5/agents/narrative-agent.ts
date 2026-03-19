/**
 * wan2.5/agents/narrative-agent.ts
 *
 * Narrative Agent — expands a BloomSeed into story beats,
 * emotion arcs, and pacing profiles.
 *
 * This agent understands manga storytelling grammar:
 *  - Establishing → tension building → climax → resolution
 *  - Emotion markers map to dramatic weight
 *  - Panel types imply narrative function
 */

import type {
  BloomSeed,
  NarrativeBloom,
  StoryBeat,
  EmotionArc,
  PacingProfile,
} from "../bloom/bloom-types";
import type { BloomEngineConfig } from "../bloom/bloom-engine";

/** Panel type → narrative function mapping */
const PANEL_NARRATIVE_MAP: Record<string, StoryBeat["beatType"]> = {
  establishing: "setup",
  small_inset: "rising",
  closeup: "rising",
  action: "climax",
  reaction: "falling",
  splash: "climax",
  bleed: "climax",
  tall_narrow: "rising",
  split: "rising",
  black: "resolution",
};

/** Emotion marker → emotion label */
const EMOTION_MAP: Record<string, string> = {
  anger_vein: "rage",
  sweat_drop: "anxiety",
  sparkle: "wonder",
  spiral_eyes: "confusion",
  flame_aura: "fury",
  freeze_lines: "shock",
  blush_lines: "embarrassment",
  lightning_bg: "intensity",
  petal_scatter: "beauty",
  ghost_escape: "terror",
};

export class NarrativeAgent {
  private config: BloomEngineConfig;

  constructor(config: BloomEngineConfig) {
    this.config = config;
  }

  /**
   * LLM prompt template for narrative expansion.
   * Used when backend = "webllm" or "claude".
   */
  buildPrompt(seed: BloomSeed): string {
    const panelDescs = seed.panels
      .map(
        (p) =>
          `Panel ${p.index + 1} (${p.type}): ${p.description}\n` +
          `  Dialogue: ${p.dialogue.map((d) => `${d.character}: "${d.text}"`).join(" | ")}\n` +
          `  SFX: ${p.sfx.join(", ")}\n` +
          `  Emotions: ${p.emotionMarkers.join(", ")}`
      )
      .join("\n\n");

    return `You are a manga narrative analyst. Given the following manga page, expand it into a structured story with beats, emotion arc, and pacing.

MANGA PAGE: "${seed.title}"
Era: ${seed.era} (${seed.year})
Style: ${seed.eraStyle.name}
Characters: ${seed.characters.join(", ")}

PANELS:
${panelDescs}

Respond with JSON matching this schema:
{
  "beats": [{ "beatIndex": number, "panelIndices": number[], "tension": 0-100, "beatType": "setup|rising|climax|falling|resolution", "narrativeSummary": string, "internalMonologue": string, "dramaticWeight": number }],
  "emotionArc": { "startEmotion": string, "peakEmotion": string, "endEmotion": string, "shifts": [{ "atBeat": number, "from": string, "to": string, "trigger": string }] },
  "pacing": { "overall": "slow_burn|escalating|explosive|contemplative|rhythmic", "tempoMap": [{ "beat": number, "tempo": "slow|medium|fast|freeze" }] }
}`;
  }

  /**
   * Expand seed into narrative bloom.
   * Falls back to deterministic expansion when no LLM available.
   */
  async expand(seed: BloomSeed): Promise<NarrativeBloom> {
    // Deterministic local fallback (always available)
    return this.expandLocal(seed);
  }

  private expandLocal(seed: BloomSeed): NarrativeBloom {
    const panelCount = seed.panels.length;

    // Build beats from panel types
    const beats: StoryBeat[] = seed.panels.map((panel, i) => {
      const beatType = PANEL_NARRATIVE_MAP[panel.type] || "rising";
      const tension = this.calculateTension(i, panelCount, beatType);
      const dramaticWeight = beatType === "climax" ? 3 : beatType === "setup" ? 2 : 1;

      const emotions = panel.emotionMarkers
        .map((m) => EMOTION_MAP[m])
        .filter(Boolean);

      const dialogueSummary = panel.dialogue
        .map((d) => `${d.character} speaks: "${d.text}"`)
        .join(". ");

      return {
        beatIndex: i,
        panelIndices: [i],
        tension,
        beatType,
        narrativeSummary: `${panel.description}. ${dialogueSummary}`,
        internalMonologue: emotions.length
          ? `A moment of ${emotions.join(" and ")}.`
          : `The scene unfolds with quiet weight.`,
        dramaticWeight,
      };
    });

    // Build emotion arc
    const allEmotions = seed.panels.flatMap((p) =>
      p.emotionMarkers.map((m) => EMOTION_MAP[m]).filter(Boolean)
    );
    const startEmotion = allEmotions[0] || "calm";
    const peakEmotion =
      allEmotions.find(
        (e) =>
          e === "fury" ||
          e === "intensity" ||
          e === "rage" ||
          e === "terror"
      ) ||
      allEmotions[Math.floor(allEmotions.length / 2)] ||
      "tension";
    const endEmotion = allEmotions[allEmotions.length - 1] || "resolution";

    const shifts = allEmotions
      .slice(1)
      .map((emotion, i) => ({
        atBeat: i + 1,
        from: allEmotions[i],
        to: emotion,
        trigger: seed.panels[i + 1]?.description.slice(0, 60) || "scene shift",
      }))
      .filter((s) => s.from !== s.to);

    const emotionArc: EmotionArc = {
      startEmotion,
      peakEmotion,
      endEmotion,
      shifts,
    };

    // Determine pacing
    const hasSplash = seed.panels.some((p) => p.type === "splash" || p.type === "bleed");
    const hasAction = seed.panels.some((p) => p.type === "action");

    let overall: PacingProfile["overall"];
    if (panelCount === 1) overall = "explosive";
    else if (hasSplash && hasAction) overall = "escalating";
    else if (hasAction) overall = "rhythmic";
    else overall = "slow_burn";

    const tempoMap = beats.map((b) => ({
      beat: b.beatIndex,
      tempo: (b.beatType === "climax"
        ? "fast"
        : b.beatType === "setup"
          ? "slow"
          : b.beatType === "resolution"
            ? "slow"
            : "medium") as PacingProfile["tempoMap"][0]["tempo"],
    }));

    return {
      stage: "narrative",
      seed,
      beats,
      emotionArc,
      pacing: { overall, tempoMap },
    };
  }

  private calculateTension(
    index: number,
    total: number,
    beatType: StoryBeat["beatType"]
  ): number {
    const position = total > 1 ? index / (total - 1) : 0.5;
    const baseTension = Math.round(position * 70);

    const modifier: Record<string, number> = {
      setup: -10,
      rising: 10,
      climax: 30,
      falling: -5,
      resolution: -20,
    };

    return Math.max(0, Math.min(100, baseTension + (modifier[beatType] || 0)));
  }
}
