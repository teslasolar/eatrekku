/**
 * wan2.5/agents/video-agent.ts
 *
 * Video Agent — converts cinematic shots into WAN 2.5 prompts.
 *
 * WAN 2.5 specifics:
 *  - 1080p @ 24fps, up to 10s clips
 *  - Supports camera movement directives
 *  - Style modifiers for era-specific look
 *  - Negative prompts to avoid artifacts
 */

import type {
  VisualBloom,
  VideoBloom,
  WanClip,
  CinematicShot,
} from "../bloom/bloom-types";
import type { BloomEngineConfig } from "../bloom/bloom-engine";

/** Camera movement → WAN 2.5 camera directive */
const WAN_CAMERA_DIRECTIVES: Record<string, string> = {
  static: "static camera, locked shot",
  pan_left: "smooth pan left, tracking motion",
  pan_right: "smooth pan right, tracking motion",
  tilt_up: "slow tilt up, revealing height",
  tilt_down: "slow tilt down, descending view",
  dolly_in: "steady dolly in, approaching subject",
  dolly_out: "slow dolly out, widening perspective",
  crane_up: "crane shot rising, aerial reveal",
  orbit: "slow orbit around subject, 360 perspective",
  handheld_shake: "handheld camera, subtle shake, documentary feel",
};

/** Era style → WAN 2.5 style modifiers */
const ERA_STYLE_MODIFIERS: Record<string, string[]> = {
  "Ukiyo-e Manga": [
    "ukiyo-e art style",
    "woodblock print aesthetic",
    "flat color with bold outlines",
    "washi paper texture overlay",
    "Japanese historical",
    "Edo period accurate costumes",
  ],
  "Roman Mosaic Manga": [
    "ancient Roman aesthetic",
    "marble and bronze textures",
    "earthy Mediterranean palette",
    "toga and armor details",
    "classical architecture",
    "mosaic pattern undertones",
  ],
};

/** Default negative prompt for WAN 2.5 */
const DEFAULT_NEGATIVE =
  "blurry, low quality, watermark, text overlay, modern objects, anachronistic elements, deformed faces, extra limbs, bad anatomy";

export class VideoAgent {
  private config: BloomEngineConfig;

  constructor(config: BloomEngineConfig) {
    this.config = config;
  }

  buildPrompt(visual: VisualBloom): string {
    return `You are a WAN 2.5 video generation prompt engineer. Convert these cinematic shots into precise WAN 2.5 prompts.

Each prompt should be 50-120 words, descriptive, cinematic. Include:
- Scene description (what we see)
- Camera (movement, angle)
- Lighting (mood, direction)
- Style (era-specific textures/motifs)
- Atmosphere (emotion, weight)

ERA: ${visual.narrative.seed.era}
STYLE: ${visual.narrative.seed.eraStyle.name}

SHOTS:
${visual.shots.map((s) => `Shot ${s.shotIndex}: ${s.description} | Camera: ${s.cameraMovement} | DOF: ${s.depthOfField} | Lighting: ${s.lightingMood}`).join("\n")}

Respond as JSON array of WAN 2.5 prompts.`;
  }

  async expand(visual: VisualBloom): Promise<VideoBloom> {
    return this.expandLocal(visual);
  }

  private expandLocal(visual: VisualBloom): VideoBloom {
    const eraStyleName = visual.narrative.seed.eraStyle.name;
    const styleModifiers = ERA_STYLE_MODIFIERS[eraStyleName] || [
      "historical anime style",
      "cinematic composition",
    ];
    const palette = visual.colorScript.palette;
    const motifs = visual.narrative.seed.eraStyle.motifs;

    const clips: WanClip[] = visual.shots.map((shot) =>
      this.shotToClip(shot, styleModifiers, palette, motifs)
    );

    const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);

    return {
      stage: "video",
      visual,
      clips,
      totalDuration,
    };
  }

  private shotToClip(
    shot: CinematicShot,
    styleModifiers: string[],
    palette: string[],
    motifs: string[]
  ): WanClip {
    const cameraDirective =
      WAN_CAMERA_DIRECTIVES[shot.cameraMovement] || WAN_CAMERA_DIRECTIVES.static;

    // Build the WAN 2.5 prompt
    const parts: string[] = [
      // Scene
      shot.description,
      // Camera
      `Camera: ${cameraDirective}`,
      // Shot framing
      `${this.formatShotType(shot.shotType)} shot`,
      // DOF
      `${shot.depthOfField} depth of field`,
      // Lighting
      shot.lightingMood,
      // Composition
      shot.composition,
      // Style
      styleModifiers.slice(0, 3).join(", "),
      // Motifs
      motifs.length ? `subtle ${motifs.slice(0, 2).join(" and ")} details` : "",
      // Quality
      "cinematic, masterful composition, atmospheric, high detail",
    ];

    const wan25Prompt = parts.filter(Boolean).join(". ");

    return {
      clipIndex: shot.shotIndex,
      shotIndex: shot.shotIndex,
      wan25Prompt,
      negativePrompt: DEFAULT_NEGATIVE,
      duration: shot.duration,
      resolution: "1080p",
      fps: 24,
      styleModifiers,
      cameraDirective,
    };
  }

  private formatShotType(type: CinematicShot["shotType"]): string {
    return type.replace(/_/g, " ");
  }
}
