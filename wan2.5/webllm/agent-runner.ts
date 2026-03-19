/**
 * wan2.5/webllm/agent-runner.ts
 *
 * Agent Runner — connects WebLLM inference to bloom agents.
 *
 * Manages model loading, agent prompt routing, and fallback
 * when WebGPU isn't available (falls back to local deterministic).
 */

import {
  WebLLMProvider,
  AGENT_MODEL_MAP,
  type WebLLMModelId,
  type WebLLMProgress,
} from "./webllm-provider";
import { NarrativeAgent } from "../agents/narrative-agent";
import { VisualAgent } from "../agents/visual-agent";
import { VideoAgent } from "../agents/video-agent";
import { AudioAgent } from "../agents/audio-agent";
import type { BloomSeed, NarrativeBloom, VisualBloom, VideoBloom } from "../bloom/bloom-types";

export type AgentName = "narrative-agent" | "visual-agent" | "video-agent" | "audio-agent";

interface RunnerConfig {
  onProgress?: (agent: AgentName, progress: WebLLMProgress) => void;
  /** Override model for all agents */
  modelOverride?: WebLLMModelId;
  /** Temperature per agent */
  temperatures?: Partial<Record<AgentName, number>>;
}

/**
 * AgentRunner routes bloom agent work through WebLLM.
 *
 * Each agent has a recommended model. The runner loads models on demand,
 * reusing them when consecutive agents share the same model.
 *
 * If WebGPU is unavailable, all agents run in local deterministic mode.
 */
export class AgentRunner {
  private config: RunnerConfig;
  private provider: WebLLMProvider | null = null;
  private currentModel: string | null = null;
  private webgpuAvailable: boolean | null = null;

  constructor(config: RunnerConfig = {}) {
    this.config = config;
  }

  /**
   * Run the narrative agent through WebLLM.
   */
  async runNarrative(seed: BloomSeed): Promise<NarrativeBloom> {
    const agent = new NarrativeAgent({ backend: "webllm" });
    const prompt = agent.buildPrompt(seed);

    const canUseGpu = await this.checkWebGPU();
    if (!canUseGpu) {
      return agent.expand(seed);
    }

    const response = await this.infer("narrative-agent", [
      { role: "system", content: "You are a manga narrative analyst. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ]);

    try {
      const data = JSON.parse(this.cleanJSON(response));
      // Merge LLM output with seed to create full NarrativeBloom
      return {
        stage: "narrative",
        seed,
        beats: data.beats || [],
        emotionArc: data.emotionArc || { startEmotion: "calm", peakEmotion: "tension", endEmotion: "resolution", shifts: [] },
        pacing: data.pacing || { overall: "slow_burn", tempoMap: [] },
      };
    } catch {
      // JSON parse failed — fall back to local
      return agent.expand(seed);
    }
  }

  /**
   * Run the visual agent through WebLLM.
   */
  async runVisual(narrative: NarrativeBloom): Promise<VisualBloom> {
    const agent = new VisualAgent({ backend: "webllm" });
    const canUseGpu = await this.checkWebGPU();
    if (!canUseGpu) return agent.expand(narrative);

    const prompt = agent.buildPrompt(narrative);
    const response = await this.infer("visual-agent", [
      { role: "system", content: "You are a cinematic director. Convert manga beats to camera shots. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ]);

    try {
      const data = JSON.parse(this.cleanJSON(response));
      return {
        stage: "visual",
        narrative,
        shots: data.shots || [],
        colorScript: data.colorScript || { palette: narrative.seed.eraStyle.palette, dominantHue: narrative.seed.eraStyle.palette[0], shifts: [] },
        transitions: data.transitions || [],
      };
    } catch {
      return agent.expand(narrative);
    }
  }

  /**
   * Run the video agent through WebLLM.
   */
  async runVideo(visual: VisualBloom): Promise<VideoBloom> {
    const agent = new VideoAgent({ backend: "webllm" });
    const canUseGpu = await this.checkWebGPU();
    if (!canUseGpu) return agent.expand(visual);

    const prompt = agent.buildPrompt(visual);
    const response = await this.infer("video-agent", [
      { role: "system", content: "You are a WAN 2.5 prompt engineer. Create video generation prompts. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ]);

    try {
      const data = JSON.parse(this.cleanJSON(response));
      return {
        stage: "video",
        visual,
        clips: data.clips || [],
        totalDuration: (data.clips || []).reduce((s: number, c: any) => s + (c.duration || 5), 0),
      };
    } catch {
      return agent.expand(visual);
    }
  }

  /**
   * Free GPU memory.
   */
  async dispose(): Promise<void> {
    if (this.provider) {
      await this.provider.unload();
      this.provider = null;
      this.currentModel = null;
    }
  }

  // ─── Internals ───

  private async checkWebGPU(): Promise<boolean> {
    if (this.webgpuAvailable !== null) return this.webgpuAvailable;
    this.webgpuAvailable = await WebLLMProvider.isSupported();
    return this.webgpuAvailable;
  }

  private async infer(
    agent: AgentName,
    messages: { role: "system" | "user" | "assistant"; content: string }[]
  ): Promise<string> {
    const modelId = this.config.modelOverride || AGENT_MODEL_MAP[agent];
    const temperature = this.config.temperatures?.[agent] ?? 0.7;

    // Swap model if needed
    if (this.currentModel !== modelId) {
      if (this.provider) await this.provider.unload();
      this.provider = new WebLLMProvider({
        modelId,
        temperature,
        onProgress: (p) => this.config.onProgress?.(agent, p),
      });
      await this.provider.init();
      this.currentModel = modelId;
    }

    const response = await this.provider!.chat(messages);
    return response.text;
  }

  private cleanJSON(text: string): string {
    let clean = text.trim();
    if (clean.startsWith("```")) {
      clean = clean.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }
    return clean;
  }
}
