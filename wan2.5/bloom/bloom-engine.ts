/**
 * wan2.5/bloom/bloom-engine.ts
 *
 * The Bloom Engine orchestrates the cascade from seed → narrative →
 * visual → video → audio, delegating each stage to a specialized agent.
 *
 * Each agent can run via:
 *  1. WebLLM (browser-side, small models like Qwen 2.5 3B / Phi 3.5)
 *  2. Claude API (server-side, high quality)
 *  3. Local fallback (deterministic, no LLM)
 */

import type {
  BloomTree,
  BloomSeed,
  NarrativeBloom,
  VisualBloom,
  VideoBloom,
  AudioBloom,
  AgentLogEntry,
} from "./bloom-types";

import { NarrativeAgent } from "../agents/narrative-agent";
import { VisualAgent } from "../agents/visual-agent";
import { VideoAgent } from "../agents/video-agent";
import { AudioAgent } from "../agents/audio-agent";

export interface BloomEngineConfig {
  /** Which inference backend to use */
  backend: "webllm" | "claude" | "local";
  /** WebLLM model ID (if backend = "webllm") */
  webllmModel?: string;
  /** Claude API key (if backend = "claude") */
  claudeApiKey?: string;
  /** Max WAN 2.5 clip duration in seconds */
  maxClipDuration?: number;
  /** Target total video duration in seconds */
  targetDuration?: number;
}

const DEFAULT_CONFIG: BloomEngineConfig = {
  backend: "local",
  maxClipDuration: 10,
  targetDuration: 30,
};

export class BloomEngine {
  private config: BloomEngineConfig;
  private narrativeAgent: NarrativeAgent;
  private visualAgent: VisualAgent;
  private videoAgent: VideoAgent;
  private audioAgent: AudioAgent;

  constructor(config: Partial<BloomEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.narrativeAgent = new NarrativeAgent(this.config);
    this.visualAgent = new VisualAgent(this.config);
    this.videoAgent = new VideoAgent(this.config);
    this.audioAgent = new AudioAgent(this.config);
  }

  /**
   * Run the full bloom cascade from seed to complete tree.
   */
  async bloom(seed: BloomSeed): Promise<BloomTree> {
    const tree: BloomTree = {
      id: `bloom-${seed.mangaPageId}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      seed,
      status: "seeding",
      currentStage: "seed",
      agentLog: [],
    };

    try {
      // Stage 1: Narrative
      tree.currentStage = "narrative";
      tree.status = "blooming";
      const narrativeStart = Date.now();
      tree.narrative = await this.narrativeAgent.expand(seed);
      this.log(tree, "narrative-agent", "narrative", narrativeStart);

      // Stage 2: Visual
      tree.currentStage = "visual";
      const visualStart = Date.now();
      tree.visual = await this.visualAgent.expand(tree.narrative);
      this.log(tree, "visual-agent", "visual", visualStart);

      // Stage 3: Video (WAN 2.5 prompts)
      tree.currentStage = "video";
      const videoStart = Date.now();
      tree.video = await this.videoAgent.expand(tree.visual);
      this.log(tree, "video-agent", "video", videoStart);

      // Stage 4: Audio
      tree.currentStage = "audio";
      const audioStart = Date.now();
      tree.audio = await this.audioAgent.expand(tree.video, seed);
      this.log(tree, "audio-agent", "audio", audioStart);

      tree.status = "complete";
    } catch (err) {
      tree.status = "error";
      this.log(tree, "bloom-engine", tree.currentStage, Date.now(), String(err));
    }

    return tree;
  }

  /**
   * Run bloom up to a specific stage (for incremental/preview use).
   */
  async bloomTo(seed: BloomSeed, stopAt: "narrative" | "visual" | "video" | "audio"): Promise<BloomTree> {
    const tree: BloomTree = {
      id: `bloom-${seed.mangaPageId}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      seed,
      status: "blooming",
      currentStage: "seed",
      agentLog: [],
    };

    const stages = ["narrative", "visual", "video", "audio"] as const;
    const stopIndex = stages.indexOf(stopAt);

    for (let i = 0; i <= stopIndex; i++) {
      const stage = stages[i];
      tree.currentStage = stage;
      const start = Date.now();

      switch (stage) {
        case "narrative":
          tree.narrative = await this.narrativeAgent.expand(seed);
          break;
        case "visual":
          if (!tree.narrative) throw new Error("Missing narrative for visual bloom");
          tree.visual = await this.visualAgent.expand(tree.narrative);
          break;
        case "video":
          if (!tree.visual) throw new Error("Missing visual for video bloom");
          tree.video = await this.videoAgent.expand(tree.visual);
          break;
        case "audio":
          if (!tree.video) throw new Error("Missing video for audio bloom");
          tree.audio = await this.audioAgent.expand(tree.video, seed);
          break;
      }

      this.log(tree, `${stage}-agent`, stage, start);
    }

    tree.status = "complete";
    return tree;
  }

  private log(
    tree: BloomTree,
    agent: string,
    stage: string,
    startTime: number,
    error?: string
  ) {
    const entry: AgentLogEntry = {
      agent,
      stage: stage as AgentLogEntry["stage"],
      timestamp: new Date().toISOString(),
      input: `${stage} input`,
      output: error || `${stage} complete`,
      model: this.config.backend === "webllm" ? this.config.webllmModel : this.config.backend,
      durationMs: Date.now() - startTime,
    };
    tree.agentLog.push(entry);
  }
}
