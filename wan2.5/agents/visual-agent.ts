/**
 * wan2.5/agents/visual-agent.ts
 *
 * Visual Agent — converts narrative beats into cinematic shots,
 * camera movements, and color scripts for WAN 2.5 video generation.
 *
 * Understands manga panel grammar → cinematic language:
 *  - establishing panel → extreme wide / crane shot
 *  - closeup panel → shallow DOF, static or slow dolly
 *  - action panel → handheld, fast pans, speed lines → motion blur
 *  - splash panel → epic wide, slow orbit
 */

import type {
  NarrativeBloom,
  VisualBloom,
  CinematicShot,
  ColorScript,
  Transition,
  StoryBeat,
} from "../bloom/bloom-types";
import type { BloomEngineConfig } from "../bloom/bloom-engine";

/** Beat type → default camera choices */
const BEAT_CAMERA_MAP: Record<
  StoryBeat["beatType"],
  { shotType: CinematicShot["shotType"]; camera: CinematicShot["cameraMovement"]; dof: CinematicShot["depthOfField"] }
> = {
  setup: { shotType: "extreme_wide", camera: "crane_up", dof: "deep" },
  rising: { shotType: "medium", camera: "dolly_in", dof: "medium" },
  climax: { shotType: "close", camera: "handheld_shake", dof: "shallow" },
  falling: { shotType: "medium", camera: "pan_right", dof: "medium" },
  resolution: { shotType: "wide", camera: "dolly_out", dof: "deep" },
};

/** Pacing tempo → shot duration */
const TEMPO_DURATION: Record<string, number> = {
  slow: 8,
  medium: 5,
  fast: 3,
  freeze: 10,
};

/** Beat type → transition type */
const BEAT_TRANSITION: Record<string, Transition["type"]> = {
  setup: "dissolve",
  rising: "cut",
  climax: "smash_cut",
  falling: "dissolve",
  resolution: "fade_black",
};

export class VisualAgent {
  private config: BloomEngineConfig;

  constructor(config: BloomEngineConfig) {
    this.config = config;
  }

  buildPrompt(narrative: NarrativeBloom): string {
    const beatDescs = narrative.beats
      .map(
        (b) =>
          `Beat ${b.beatIndex} (${b.beatType}, tension ${b.tension}): ${b.narrativeSummary}`
      )
      .join("\n");

    return `You are a cinematic director converting manga narrative beats into camera shots for AI video generation.

ERA STYLE: ${narrative.seed.eraStyle.name}
PALETTE: ${narrative.seed.eraStyle.palette.join(", ")}
TEXTURES: ${narrative.seed.eraStyle.textures.join(", ")}
PACING: ${narrative.pacing.overall}
EMOTION ARC: ${narrative.emotionArc.startEmotion} → ${narrative.emotionArc.peakEmotion} → ${narrative.emotionArc.endEmotion}

BEATS:
${beatDescs}

For each beat, define a cinematic shot with: shotType, cameraMovement, duration (3-10s), composition, depthOfField, lightingMood, and a rich visual description.
Also define transitions between shots and a color script.

Respond as JSON.`;
  }

  async expand(narrative: NarrativeBloom): Promise<VisualBloom> {
    return this.expandLocal(narrative);
  }

  private expandLocal(narrative: NarrativeBloom): VisualBloom {
    const maxClip = this.config.maxClipDuration || 10;
    const palette = narrative.seed.eraStyle.palette;
    const textures = narrative.seed.eraStyle.textures;

    // Build shots from beats
    const shots: CinematicShot[] = narrative.beats.map((beat, i) => {
      const defaults = BEAT_CAMERA_MAP[beat.beatType];
      const tempo =
        narrative.pacing.tempoMap.find((t) => t.beat === beat.beatIndex)
          ?.tempo || "medium";
      const duration = Math.min(TEMPO_DURATION[tempo], maxClip);

      // Panel type from original seed to refine shot
      const seedPanel = narrative.seed.panels[beat.panelIndices[0]];
      const panelType = seedPanel?.type || "closeup";

      // Refine shot type based on panel
      let shotType = defaults.shotType;
      if (panelType === "splash") shotType = "extreme_wide";
      else if (panelType === "small_inset") shotType = "extreme_close";
      else if (panelType === "action") shotType = "medium";

      // Refine camera based on SFX (speed lines → pan, radial → orbit)
      let camera = defaults.camera;
      if (seedPanel?.sfx.some((s) => s.includes("シャキ") || s.includes("ヒュッ")))
        camera = "pan_left";
      if (seedPanel?.sfx.some((s) => s.includes("ゴゴゴ")))
        camera = "dolly_in";

      // Lighting from emotion
      const emotions = seedPanel?.emotionMarkers || [];
      let lightingMood = "natural daylight";
      if (emotions.includes("flame_aura") || emotions.includes("anger_vein"))
        lightingMood = "warm ember glow, harsh shadows";
      else if (emotions.includes("freeze_lines") || emotions.includes("ghost_escape"))
        lightingMood = "cold blue moonlight, fog";
      else if (emotions.includes("sparkle") || emotions.includes("petal_scatter"))
        lightingMood = "soft golden hour, lens flare";
      else if (emotions.includes("lightning_bg"))
        lightingMood = "dramatic side lighting, stark contrast";

      // Composition
      const compositions = [
        "rule of thirds, subject off-center",
        "centered symmetry, commanding presence",
        "leading lines drawing eye inward",
        "diagonal composition, dynamic energy",
        "negative space emphasizing isolation",
      ];
      const composition = compositions[i % compositions.length];

      return {
        shotIndex: i,
        beatIndex: beat.beatIndex,
        shotType,
        cameraMovement: camera,
        duration,
        composition,
        depthOfField: defaults.dof,
        lightingMood,
        description: `${beat.narrativeSummary} — ${narrative.seed.eraStyle.name} style, ${textures.join(" and ")} textures, ${lightingMood}`,
      };
    });

    // Color script
    const colorScript: ColorScript = {
      palette,
      dominantHue: palette[0],
      shifts: narrative.emotionArc.shifts.map((s) => ({
        atShot: s.atBeat,
        hue: palette[Math.min(s.atBeat, palette.length - 1)],
        reason: s.trigger,
      })),
    };

    // Transitions
    const transitions: Transition[] = [];
    for (let i = 0; i < shots.length - 1; i++) {
      const beat = narrative.beats[i + 1];
      transitions.push({
        fromShot: i,
        toShot: i + 1,
        type: BEAT_TRANSITION[beat.beatType] || "cut",
        duration: beat.beatType === "climax" ? 0.1 : 0.5,
      });
    }

    return {
      stage: "visual",
      narrative,
      shots,
      colorScript,
      transitions,
    };
  }
}
