/**
 * wan2.5/bloom/bloom-types.ts
 *
 * Bloom Prompt System — Core types
 *
 * The "bloom" is a cascading prompt tree that grows from a root seed
 * (a manga page / historical event) through layers of specialized agents,
 * each expanding detail until the final output is a WAN 2.5 video prompt.
 *
 * Root (MangaPage)
 *  └─ Narrative Bloom  → expands story beats, emotion arcs
 *      └─ Visual Bloom  → expands panel descriptions into cinematography
 *          └─ Video Bloom → converts to WAN 2.5 prompt with camera/motion
 *              └─ Audio Bloom → SFX, voice, atmosphere from manga SFX data
 */

// ─── Bloom Layers ───

export type BloomStage =
  | "seed"        // raw manga page data from root
  | "narrative"   // expanded story beats + emotion arc
  | "visual"      // cinematography + composition
  | "video"       // WAN 2.5 prompt-ready
  | "audio";      // synchronized audio cues

export interface BloomSeed {
  stage: "seed";
  mangaPageId: string;
  title: string;
  era: string;
  year: string;
  panels: SeedPanel[];
  characters: string[];
  eraStyle: {
    name: string;
    palette: string[];
    textures: string[];
    motifs: string[];
  };
}

export interface SeedPanel {
  index: number;
  type: string;           // PanelType from root
  description: string;
  dialogue: SeedDialogue[];
  sfx: string[];           // japanese SFX strings
  emotionMarkers: string[];
  characters: string[];
  footnote?: string;
}

export interface SeedDialogue {
  character: string;
  text: string;
  bubbleType: string;
}

// ─── Narrative Bloom ───

export interface NarrativeBloom {
  stage: "narrative";
  seed: BloomSeed;
  beats: StoryBeat[];
  emotionArc: EmotionArc;
  pacing: PacingProfile;
}

export interface StoryBeat {
  beatIndex: number;
  panelIndices: number[];    // which panels this beat covers
  tension: number;           // 0-100
  beatType: "setup" | "rising" | "climax" | "falling" | "resolution";
  narrativeSummary: string;
  internalMonologue: string; // character's inner state
  dramaticWeight: number;    // how long this beat should be in video (relative)
}

export interface EmotionArc {
  startEmotion: string;
  peakEmotion: string;
  endEmotion: string;
  shifts: { atBeat: number; from: string; to: string; trigger: string }[];
}

export interface PacingProfile {
  overall: "slow_burn" | "escalating" | "explosive" | "contemplative" | "rhythmic";
  tempoMap: { beat: number; tempo: "slow" | "medium" | "fast" | "freeze" }[];
}

// ─── Visual Bloom ───

export interface VisualBloom {
  stage: "visual";
  narrative: NarrativeBloom;
  shots: CinematicShot[];
  colorScript: ColorScript;
  transitions: Transition[];
}

export interface CinematicShot {
  shotIndex: number;
  beatIndex: number;
  shotType: "extreme_wide" | "wide" | "medium" | "close" | "extreme_close" | "over_shoulder" | "pov" | "bird_eye" | "low_angle" | "dutch_angle";
  cameraMovement: "static" | "pan_left" | "pan_right" | "tilt_up" | "tilt_down" | "dolly_in" | "dolly_out" | "crane_up" | "orbit" | "handheld_shake";
  duration: number;          // seconds (WAN 2.5 supports up to 10s clips)
  composition: string;       // rule of thirds, leading lines, etc.
  depthOfField: "shallow" | "medium" | "deep";
  lightingMood: string;      // "warm ember glow", "cold moonlight", etc.
  description: string;       // full visual description for WAN 2.5
}

export interface ColorScript {
  palette: string[];
  dominantHue: string;
  shifts: { atShot: number; hue: string; reason: string }[];
}

export interface Transition {
  fromShot: number;
  toShot: number;
  type: "cut" | "dissolve" | "wipe" | "match_cut" | "smash_cut" | "fade_black" | "fade_white";
  duration: number;
}

// ─── Video Bloom (WAN 2.5 output) ───

export interface VideoBloom {
  stage: "video";
  visual: VisualBloom;
  clips: WanClip[];
  totalDuration: number;
}

export interface WanClip {
  clipIndex: number;
  shotIndex: number;
  wan25Prompt: string;       // the actual prompt for WAN 2.5
  negativePrompt: string;
  duration: number;
  resolution: "720p" | "1080p";
  fps: 24;
  styleModifiers: string[];  // era-specific style tags
  cameraDirective: string;   // WAN 2.5 camera control string
}

// ─── Audio Bloom ───

export interface AudioBloom {
  stage: "audio";
  video: VideoBloom;
  voiceLines: VoiceLine[];
  sfxCues: SfxCue[];
  ambience: AmbienceCue[];
}

export interface VoiceLine {
  clipIndex: number;
  character: string;
  text: string;
  emotion: string;
  startTime: number;
  language: "ja" | "en";
}

export interface SfxCue {
  clipIndex: number;
  sfxJapanese: string;
  description: string;
  startTime: number;
  volume: number;     // 0-1
}

export interface AmbienceCue {
  clipIndex: number;
  description: string;  // "crackling fire", "wind through bamboo"
  startTime: number;
  fadeIn: number;
  fadeOut: number;
}

// ─── Full Bloom Tree ───

export interface BloomTree {
  id: string;
  createdAt: string;
  seed: BloomSeed;
  narrative?: NarrativeBloom;
  visual?: VisualBloom;
  video?: VideoBloom;
  audio?: AudioBloom;
  status: "seeding" | "blooming" | "complete" | "error";
  currentStage: BloomStage;
  agentLog: AgentLogEntry[];
}

export interface AgentLogEntry {
  agent: string;
  stage: BloomStage;
  timestamp: string;
  input: string;
  output: string;
  model?: string;       // which LLM was used
  durationMs: number;
}
