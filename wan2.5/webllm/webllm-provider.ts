/**
 * wan2.5/webllm/webllm-provider.ts
 *
 * WebLLM Provider — runs open-source LLMs in the browser via WebGPU.
 *
 * Supported models for bloom agent inference:
 *  - Qwen 2.5 3B    (best for narrative/visual — good at structured JSON)
 *  - Phi 3.5 Mini    (fast, good for audio/SFX mapping)
 *  - Llama 3.2 3B    (general purpose fallback)
 *  - Gemma 2 2B      (lightweight, quick iterations)
 *
 * WebLLM runs entirely client-side via WebGPU — no server, no API keys,
 * full privacy. Models are cached in the browser after first download.
 *
 * @see https://github.com/mlc-ai/web-llm
 */

/** Model registry — maps friendly names to WebLLM model IDs */
export const WEBLLM_MODELS = {
  "qwen-2.5-3b": "Qwen2.5-3B-Instruct-q4f16_1-MLC",
  "phi-3.5-mini": "Phi-3.5-mini-instruct-q4f16_1-MLC",
  "llama-3.2-3b": "Llama-3.2-3B-Instruct-q4f16_1-MLC",
  "gemma-2-2b": "gemma-2-2b-it-q4f16_1-MLC",
} as const;

export type WebLLMModelId = keyof typeof WEBLLM_MODELS;

/** Default model for bloom agents */
export const DEFAULT_MODEL: WebLLMModelId = "qwen-2.5-3b";

/** Model recommendations per agent */
export const AGENT_MODEL_MAP: Record<string, WebLLMModelId> = {
  "narrative-agent": "qwen-2.5-3b",   // best at structured narrative
  "visual-agent": "qwen-2.5-3b",      // best at descriptive prompts
  "video-agent": "phi-3.5-mini",       // fast, good at format conversion
  "audio-agent": "gemma-2-2b",        // lightweight, SFX mapping
};

export interface WebLLMConfig {
  modelId: WebLLMModelId;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  onProgress?: (progress: WebLLMProgress) => void;
}

export interface WebLLMProgress {
  stage: "download" | "init" | "inference";
  progress: number;   // 0-100
  message: string;
}

export interface WebLLMResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
  model: string;
}

/**
 * WebLLM Provider
 *
 * Wraps the @mlc-ai/web-llm library with an OpenAI-compatible interface.
 * Uses WebGPU for hardware-accelerated inference entirely in the browser.
 *
 * Usage:
 *   const provider = new WebLLMProvider({ modelId: "qwen-2.5-3b" });
 *   await provider.init();
 *   const response = await provider.chat([
 *     { role: "system", content: "You are a manga narrative analyst." },
 *     { role: "user", content: "Expand this scene..." }
 *   ]);
 */
export class WebLLMProvider {
  private config: WebLLMConfig;
  private engine: any = null; // MLCEngine from @mlc-ai/web-llm
  private initialized = false;

  constructor(config: Partial<WebLLMConfig> = {}) {
    this.config = {
      modelId: config.modelId || DEFAULT_MODEL,
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 2048,
      topP: config.topP ?? 0.95,
      onProgress: config.onProgress,
    };
  }

  /**
   * Check if WebGPU is available in this browser.
   */
  static async isSupported(): Promise<boolean> {
    if (typeof navigator === "undefined") return false;
    if (!("gpu" in navigator)) return false;
    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      return adapter !== null;
    } catch {
      return false;
    }
  }

  /**
   * Initialize the WebLLM engine with the selected model.
   * First call downloads the model (~200-500MB, cached after).
   */
  async init(): Promise<void> {
    if (this.initialized) return;

    const supported = await WebLLMProvider.isSupported();
    if (!supported) {
      throw new Error(
        "WebGPU is not available. WebLLM requires Chrome 113+, Edge, or compatible browser."
      );
    }

    this.report("download", 0, "Loading WebLLM engine...");

    // Dynamic import — @mlc-ai/web-llm is a browser-only package
    const webllm = await import("@mlc-ai/web-llm");
    const modelTag = WEBLLM_MODELS[this.config.modelId];

    this.engine = await webllm.CreateMLCEngine(modelTag, {
      initProgressCallback: (report: any) => {
        this.report("download", report.progress * 100, report.text);
      },
    });

    this.initialized = true;
    this.report("init", 100, "Model loaded and ready");
  }

  /**
   * Run chat completion (OpenAI-compatible interface).
   */
  async chat(
    messages: { role: "system" | "user" | "assistant"; content: string }[]
  ): Promise<WebLLMResponse> {
    if (!this.initialized || !this.engine) {
      throw new Error("WebLLM not initialized. Call init() first.");
    }

    this.report("inference", 0, "Generating...");
    const start = Date.now();

    const reply = await this.engine.chat.completions.create({
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      top_p: this.config.topP,
    });

    const text = reply.choices?.[0]?.message?.content || "";
    const usage = reply.usage || {};

    this.report("inference", 100, "Complete");

    return {
      text,
      usage: {
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0,
      },
      durationMs: Date.now() - start,
      model: WEBLLM_MODELS[this.config.modelId],
    };
  }

  /**
   * Run chat and parse response as JSON.
   * Handles markdown code fences that models sometimes wrap JSON in.
   */
  async chatJSON<T = any>(
    messages: { role: "system" | "user" | "assistant"; content: string }[]
  ): Promise<{ data: T; raw: WebLLMResponse }> {
    const response = await this.chat(messages);
    let text = response.text.trim();

    // Strip markdown code fences
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const data = JSON.parse(text) as T;
    return { data, raw: response };
  }

  /**
   * Unload the model and free GPU memory.
   */
  async unload(): Promise<void> {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.initialized = false;
    }
  }

  private report(stage: WebLLMProgress["stage"], progress: number, message: string) {
    this.config.onProgress?.({ stage, progress, message });
  }
}
