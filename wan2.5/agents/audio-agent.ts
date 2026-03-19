/**
 * wan2.5/agents/audio-agent.ts
 *
 * Audio Agent — maps manga SFX, dialogue, and atmosphere
 * to synchronized audio cues for WAN 2.5's native audio output.
 *
 * WAN 2.5 supports unified audio-visual synthesis:
 *  - Voice lines with lip-sync
 *  - Sound effects
 *  - Ambient atmosphere
 */

import type {
  VideoBloom,
  AudioBloom,
  VoiceLine,
  SfxCue,
  AmbienceCue,
  BloomSeed,
} from "../bloom/bloom-types";
import type { BloomEngineConfig } from "../bloom/bloom-engine";

/** Manga SFX → audio description mapping */
const SFX_AUDIO_MAP: Record<string, string> = {
  // Impact / action
  "ドカーン": "loud explosion, thunderous impact",
  "バーン": "sharp bang, gunshot-like crack",
  "ガキーン": "metal clashing, sword on stone",
  "シャキーン": "sword unsheathing, bright metallic ring",
  // Environment
  "ザーザー": "heavy rain pouring",
  "ビューー": "strong wind howling",
  "パチパチ": "crackling fire, embers popping",
  "ゴゴゴゴ": "deep rumbling, ominous pressure",
  // Quiet
  "シーン": "profound silence, ringing stillness",
  // Emotion
  "ドキドキ": "heartbeat, thumping pulse",
  "ヒュッ": "sharp whoosh, blade cutting air",
  // Comedy
  "はっはっは": "boisterous laughter",
  "ニャッ": "startled cat meow",
};

/** Era → ambient atmosphere */
const ERA_AMBIENCE: Record<string, string[]> = {
  "Edo Japan": [
    "distant temple bells",
    "bamboo grove rustling",
    "cicadas in summer heat",
    "wooden floor creaking",
    "shamisen plucking softly",
  ],
  "Ancient Rome": [
    "distant crowd murmur in marble halls",
    "sandals on stone floor",
    "fountain trickling",
    "eagle cry overhead",
    "iron forge hammering",
  ],
};

export class AudioAgent {
  private config: BloomEngineConfig;

  constructor(config: BloomEngineConfig) {
    this.config = config;
  }

  async expand(video: VideoBloom, seed: BloomSeed): Promise<AudioBloom> {
    return this.expandLocal(video, seed);
  }

  private expandLocal(video: VideoBloom, seed: BloomSeed): AudioBloom {
    const voiceLines: VoiceLine[] = [];
    const sfxCues: SfxCue[] = [];
    const ambience: AmbienceCue[] = [];

    for (const clip of video.clips) {
      const beatIndex = clip.shotIndex;
      const panel = seed.panels[beatIndex];
      if (!panel) continue;

      // Voice lines from dialogue
      let timeOffset = 0.5; // start 0.5s into clip
      for (const dialogue of panel.dialogue) {
        if (dialogue.bubbleType === "sfx") continue; // SFX bubbles handled below

        const isJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(
          dialogue.text
        );

        voiceLines.push({
          clipIndex: clip.clipIndex,
          character: dialogue.character,
          text: dialogue.text,
          emotion: this.inferEmotionFromBubble(dialogue.bubbleType),
          startTime: timeOffset,
          language: isJapanese ? "ja" : "en",
        });

        // Rough time estimate: ~2s per line
        timeOffset += 2;
      }

      // SFX from manga sound effects
      for (const sfx of panel.sfx) {
        const audioDesc = this.lookupSfx(sfx);
        sfxCues.push({
          clipIndex: clip.clipIndex,
          sfxJapanese: sfx,
          description: audioDesc,
          startTime: 0.2, // SFX usually hit early in the shot
          volume: panel.type === "splash" || panel.type === "action" ? 0.9 : 0.6,
        });
      }

      // Ambient atmosphere (era-based)
      const eraAmbience = ERA_AMBIENCE[seed.era] || ["gentle wind"];
      const ambienceDesc =
        eraAmbience[clip.clipIndex % eraAmbience.length];

      ambience.push({
        clipIndex: clip.clipIndex,
        description: ambienceDesc,
        startTime: 0,
        fadeIn: 1,
        fadeOut: 1,
      });
    }

    return {
      stage: "audio",
      video,
      voiceLines,
      sfxCues,
      ambience,
    };
  }

  private lookupSfx(japanese: string): string {
    // Exact match
    if (SFX_AUDIO_MAP[japanese]) return SFX_AUDIO_MAP[japanese];

    // Partial match (some SFX have repeating chars)
    for (const [key, val] of Object.entries(SFX_AUDIO_MAP)) {
      if (japanese.includes(key.slice(0, 3)) || key.includes(japanese.slice(0, 3))) {
        return val;
      }
    }

    return "ambient sound effect";
  }

  private inferEmotionFromBubble(bubbleType: string): string {
    const map: Record<string, string> = {
      normal: "calm",
      shouting: "intense",
      thinking: "contemplative",
      whisper: "quiet",
      narration: "neutral",
      trembling: "fearful",
      electronic: "mechanical",
    };
    return map[bubbleType] || "neutral";
  }
}
