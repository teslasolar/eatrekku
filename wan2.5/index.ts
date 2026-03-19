/**
 * wan2.5/ — EaTrekku × WAN 2.5 Video Generation Module
 *
 * Bloom Prompt System:
 *   Seed (MangaPage) → Narrative → Visual → Video (WAN 2.5) → Audio
 *
 * Each stage is handled by a specialized agent that can run via:
 *   - WebLLM (browser-side, Qwen/Phi/Llama/Gemma via WebGPU)
 *   - Claude API (server-side, highest quality)
 *   - Local deterministic (no LLM, always available)
 */

// Bloom system
export { BloomEngine } from "./bloom/bloom-engine";
export type { BloomEngineConfig } from "./bloom/bloom-engine";
export { extractSeed } from "./bloom/seed";
export type {
  BloomTree,
  BloomSeed,
  BloomStage,
  NarrativeBloom,
  VisualBloom,
  VideoBloom,
  AudioBloom,
  WanClip,
  CinematicShot,
  StoryBeat,
  EmotionArc,
  VoiceLine,
  SfxCue,
} from "./bloom/bloom-types";

// Specialized agents
export { NarrativeAgent } from "./agents/narrative-agent";
export { VisualAgent } from "./agents/visual-agent";
export { VideoAgent } from "./agents/video-agent";
export { AudioAgent } from "./agents/audio-agent";

// WebLLM integration
export { WebLLMProvider, WEBLLM_MODELS, AGENT_MODEL_MAP } from "./webllm/webllm-provider";
export type { WebLLMConfig, WebLLMProgress, WebLLMResponse } from "./webllm/webllm-provider";
export { AgentRunner } from "./webllm/agent-runner";
