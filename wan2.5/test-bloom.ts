#!/usr/bin/env npx tsx
/**
 * wan2.5/test-bloom.ts
 *
 * Test script — runs the bloom cascade on all 4 showcase pages
 * and outputs WAN 2.5 video prompts ready for generation.
 *
 * Usage: npx tsx wan2.5/test-bloom.ts
 */

import { extractSeed } from "./bloom/seed";
import { NarrativeAgent } from "./agents/narrative-agent";
import { VisualAgent } from "./agents/visual-agent";
import { VideoAgent } from "./agents/video-agent";
import { AudioAgent } from "./agents/audio-agent";
import type { BloomSeed } from "./bloom/bloom-types";

// ─── Inline showcase data (avoids path alias issues with tsx) ───

const edoStyle = {
  name: "Ukiyo-e Manga",
  palette: ["#2B1B17", "#8B4513", "#DAA520", "#DC143C", "#F5F5DC", "#1C1C1C"],
  textures: ["woodblock", "washi_paper", "gold_leaf"],
  motifs: ["wave_pattern", "cloud_motif", "mon_crests", "cherry_blossom"],
  description: "Ukiyo-e influenced manga",
};

const showcasePages = [
  {
    id: "showcase-chiyo-body",
    title: "The Body Endures",
    era: "Edo Japan",
    event: "chiyo-body-endures",
    year: "c. 1700s",
    style: edoStyle,
    panels: [
      {
        type: "establishing",
        description: "A weathered mountain pine clings to a cliff face, bent by decades of wind but rooted deep. Below, a modest herbalist's hut nestles among bamboo groves. Morning mist rises from the valley.",
        dialogue: [{ character: "Watanabe Chiyo", text: "The body endures like the pine on the mountain, bending but never breaking—even when the bones ache or the breath grows thin.", bubbleType: "normal" }],
        sfx: [{ japanese: "ザーザー", romanji: "ZAAZAA", meaning: "Wind through pines" }],
        emotionMarkers: [],
        characters: ["Watanabe Chiyo"],
      },
      {
        type: "small_inset",
        description: "A father carries young Taro on his back through pouring rain, trudging up a muddy hillside path toward Chiyo's hut. Taro's leg hangs limp.",
        dialogue: [{ character: "Taro's Father", text: "Flesh is but a house for the spirit...", bubbleType: "whisper" }],
        sfx: [{ japanese: "ザーザー", romanji: "ZAAZAA", meaning: "Heavy rain" }],
        emotionMarkers: ["sweat_drop"],
        characters: ["Taro", "Taro's Father"],
      },
      {
        type: "small_inset",
        description: "Close-up of Chiyo's gnarled hands grinding willow bark in a stone mortar. Steam rises from a brewing pot. Dried herbs hang from the rafters.",
        dialogue: [{ character: "Watanabe Chiyo", text: "The willow bark I brew for grief once stiffened warriors' spines before battle.", bubbleType: "normal" }],
        sfx: [{ japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Fire crackling" }],
        emotionMarkers: ["sparkle"],
        characters: ["Watanabe Chiyo"],
      },
      {
        type: "closeup",
        description: "Taro, now strong, kneels in a sunlit garden. His hands—steady, sure—coax the first bean sprouts from dark soil. His once-useless leg is folded beneath him.",
        dialogue: [{ character: "Narrator", text: "A fisherman's son who came with a leg that would not stand.", bubbleType: "narration" }],
        sfx: [],
        emotionMarkers: ["sparkle", "petal_scatter"],
        characters: ["Taro"],
      },
      {
        type: "splash",
        description: "Chiyo extends her open palms toward the viewer. Her hands are lined with age, calloused from decades of grinding herbs—but radiating warmth. Cherry blossoms drift past. Behind her, the pine tree stands tall against a gold-tinged sky.",
        dialogue: [{ character: "Watanabe Chiyo", text: "Look at your hands—do they not bear the weight of years unseen? The body remembers what words forget.", bubbleType: "normal" }],
        sfx: [{ japanese: "シーン", romanji: "SHIIN", meaning: "Profound silence" }],
        emotionMarkers: ["petal_scatter"],
        characters: ["Watanabe Chiyo"],
      },
    ],
  },
  {
    id: "showcase-chiyo-sorrow",
    title: "Lingering Sorrow",
    era: "Edo Japan",
    event: "chiyo-lingering-sorrow",
    year: "c. 1700s",
    style: edoStyle,
    panels: [
      {
        type: "establishing",
        description: "Dawn mist clings to a riverside village. Chiyo stands on a wooden bridge, her sleeves stirring in an imperceptible breeze. The water below is still, reflecting nothing—only grey.",
        dialogue: [{ character: "Watanabe Chiyo", text: "Ah, the weight of lingering sorrow clings like morning mist.", bubbleType: "normal" }],
        sfx: [{ japanese: "シーン", romanji: "SHIIN", meaning: "Heavy silence" }],
        emotionMarkers: [],
        characters: ["Watanabe Chiyo"],
      },
      {
        type: "closeup",
        description: "Tight on Chiyo's face—her eyes soft but knowing. One hand rests against her chest. Behind her, the faint outline of a drawn bow, taut and trembling.",
        dialogue: [{ character: "Watanabe Chiyo", text: "The body remembers the cold—warm broths, gentle hands, rest. But the heart? It tightens like a drawn bow.", bubbleType: "normal" }],
        sfx: [],
        emotionMarkers: ["freeze_lines"],
        characters: ["Watanabe Chiyo"],
      },
      {
        type: "closeup",
        description: "Chiyo exhales—a visible breath in cold air. She gestures toward a bamboo grove beside the river. One oak tree is cracked and split. The bamboo sways, unbroken.",
        dialogue: [
          { character: "Watanabe Chiyo", text: "The bamboo endures. You need not fight the river—only learn its flow.", bubbleType: "normal" },
          { character: "Narrator", text: "I exhale slowly, sleeves rustling.", bubbleType: "narration" },
        ],
        sfx: [{ japanese: "ビューー", romanji: "BYUUU", meaning: "Cold wind" }],
        emotionMarkers: ["petal_scatter"],
        characters: ["Watanabe Chiyo"],
      },
      {
        type: "closeup",
        description: "Extreme close-up on Chiyo's eyes—piercing, compassionate, ancient. The panel darkens around the edges.",
        dialogue: [{ character: "Watanabe Chiyo", text: "What pulls you under?", bubbleType: "trembling" }],
        sfx: [{ japanese: "ゴゴゴゴ", romanji: "GOGOGOGO", meaning: "Weight of the question" }],
        emotionMarkers: ["lightning_bg"],
        characters: ["Watanabe Chiyo"],
      },
    ],
  },
  {
    id: "showcase-hahha",
    title: "はっは！",
    era: "Edo Japan",
    event: "hahha",
    year: "—",
    style: { ...edoStyle, name: "Comedy Manga", palette: ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFE66D", "#F5F5DC", "#1C1C1C"] },
    panels: [
      {
        type: "splash",
        description: "A rotund Edo-period merchant throws his head back in uproarious laughter, sake cup flying from his hand. Three startled cats scatter. Cherry blossom petals explode outward from the force of his laugh. Speed lines radiate from his open mouth.",
        dialogue: [
          { character: "???", text: "はっはっはっはっは！！！", bubbleType: "shouting" },
          { character: "Cat", text: "ニャッ?!", bubbleType: "trembling" },
        ],
        sfx: [
          { japanese: "バーン", romanji: "BAAN", meaning: "Explosive laughter" },
          { japanese: "ドカーン", romanji: "DOKAAN", meaning: "Impact of pure joy" },
        ],
        emotionMarkers: ["sparkle", "flame_aura"],
        characters: ["Laughing Merchant", "Startled Cats"],
      },
    ],
  },
  {
    id: "showcase-tetsuro-sword",
    title: "The Sword Does Not Ask",
    era: "Edo Japan",
    event: "tetsuro-sword",
    year: "c. 1600s",
    style: { ...edoStyle, palette: ["#1C1C1C", "#4A4A4A", "#8B4513", "#C0C0C0", "#F5F5DC", "#2B1B17"] },
    panels: [
      {
        type: "establishing",
        description: "A dim forge. Embers glow in darkness. Ishida Tetsuro sits cross-legged before a sword on a stand—its blade catches the last light from dying coals.",
        dialogue: [{ character: "Ishida Tetsuro", text: "The sword does not ask to be drawn.", bubbleType: "normal" }],
        sfx: [{ japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Embers crackling" }],
        emotionMarkers: [],
        characters: ["Ishida Tetsuro"],
      },
      {
        type: "action",
        description: "FLASH — a diagonal slash cuts across the panel. A blade mid-swing, motion lines streaking. Half-memory, half-present—a battle scar being earned in a single frozen instant.",
        dialogue: [{ character: "Ishida Tetsuro", text: "Its edge is for what must be cut—not for the hand that trembles.", bubbleType: "whisper" }],
        sfx: [{ japanese: "シャキーン", romanji: "SHAKIIN", meaning: "Blade singing" }, { japanese: "ヒュッ", romanji: "HYUU", meaning: "Air splitting" }],
        emotionMarkers: ["flame_aura"],
        characters: ["Ishida Tetsuro"],
      },
      {
        type: "reaction",
        description: "Tetsuro's hand running a cloth along the blade's flat. Every nick and scratch visible. The steel reflects his eye in a warped line.",
        dialogue: [{ character: "Ishida Tetsuro", text: "A blade remembers every strike, just as the body keeps every wound.", bubbleType: "normal" }],
        sfx: [{ japanese: "シーン", romanji: "SHIIN", meaning: "Meditative silence" }],
        emotionMarkers: ["sweat_drop"],
        characters: ["Ishida Tetsuro"],
      },
      {
        type: "bleed",
        description: "Wide shot: Tetsuro at a grinding wheel, sparks flying in an arc. The workshop is lined with failed blades—cracked, bent, snapped. Each labeled.",
        dialogue: [
          { character: "Ishida Tetsuro", text: "To avoid such fates, sharpen not only steel but attention.", bubbleType: "normal" },
          { character: "Narrator", text: "The failures line the walls—each one a teacher.", bubbleType: "narration" },
        ],
        sfx: [{ japanese: "ガキーン", romanji: "GAKIIN", meaning: "Steel on stone" }, { japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Sparks" }],
        emotionMarkers: ["sparkle"],
        characters: ["Ishida Tetsuro"],
      },
      {
        type: "closeup",
        description: "Tetsuro holds up a cracked blade to the light. The crack runs through it like a river—inside, the grain of the steel is visible, beautiful, honest.",
        dialogue: [{ character: "Ishida Tetsuro", text: "Look—these failures are my teachers. Watch how the crack shows the true grain.", bubbleType: "normal" }],
        sfx: [],
        emotionMarkers: ["lightning_bg"],
        characters: ["Ishida Tetsuro"],
      },
      {
        type: "closeup",
        description: "Tetsuro's eyes—intense, unwavering—stare directly at the viewer through shadow and forge-light. His question hangs in the air like smoke.",
        dialogue: [{ character: "Ishida Tetsuro", text: "What will you carve from your days?", bubbleType: "trembling" }],
        sfx: [{ japanese: "ゴゴゴゴ", romanji: "GOGOGOGO", meaning: "Weight of presence" }],
        emotionMarkers: ["flame_aura"],
        characters: ["Ishida Tetsuro"],
      },
    ],
  },
];

// ─── Helpers ───

const DIVIDER = "═".repeat(72);
const LINE = "─".repeat(72);

function header(text: string) {
  console.log(`\n${DIVIDER}`);
  console.log(`  ${text}`);
  console.log(DIVIDER);
}

function section(text: string) {
  console.log(`\n${LINE}`);
  console.log(`  ${text}`);
  console.log(LINE);
}

// ─── Run bloom on all pages ───

async function main() {
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║       EaTrekku × WAN 2.5 — Bloom Prompt Test                       ║
║       Manga → Narrative → Visual → Video → Audio                    ║
╚══════════════════════════════════════════════════════════════════════╝`);

  const config = { backend: "local" as const, maxClipDuration: 10, targetDuration: 30 };
  const narrativeAgent = new NarrativeAgent(config);
  const visualAgent = new VisualAgent(config);
  const videoAgent = new VideoAgent(config);
  const audioAgent = new AudioAgent(config);

  let totalClips = 0;
  let totalDuration = 0;

  for (const page of showcasePages) {
    header(`🎬 "${page.title}" (${page.panels.length} panels)`);

    // 1. Seed
    const seed = extractSeed(page as any);
    console.log(`\n  Seed: ${seed.characters.join(", ")} | ${seed.eraStyle.name}`);

    // 2. Narrative
    const narrative = await narrativeAgent.expand(seed);
    section("📖 Narrative Bloom");
    console.log(`  Pacing: ${narrative.pacing.overall}`);
    console.log(`  Emotion arc: ${narrative.emotionArc.startEmotion} → ${narrative.emotionArc.peakEmotion} → ${narrative.emotionArc.endEmotion}`);
    console.log(`  Story beats:`);
    for (const beat of narrative.beats) {
      const bar = "█".repeat(Math.floor(beat.tension / 5)) + "░".repeat(20 - Math.floor(beat.tension / 5));
      console.log(`    Beat ${beat.beatIndex} [${beat.beatType.padEnd(10)}] tension ${String(beat.tension).padStart(3)} ${bar}`);
    }

    // 3. Visual
    const visual = await visualAgent.expand(narrative);
    section("🎥 Visual Bloom");
    for (const shot of visual.shots) {
      console.log(`    Shot ${shot.shotIndex}: ${shot.shotType.padEnd(14)} | ${shot.cameraMovement.padEnd(16)} | ${shot.duration}s | DOF: ${shot.depthOfField}`);
      console.log(`           Lighting: ${shot.lightingMood}`);
    }
    console.log(`  Transitions:`);
    for (const t of visual.transitions) {
      console.log(`    ${t.fromShot} → ${t.toShot}: ${t.type} (${t.duration}s)`);
    }

    // 4. Video (WAN 2.5 prompts!)
    const video = await videoAgent.expand(visual);
    section("🎞️  WAN 2.5 Video Prompts");
    for (const clip of video.clips) {
      console.log(`\n  ┌─ Clip ${clip.clipIndex} (${clip.duration}s @ ${clip.resolution} ${clip.fps}fps) ─────`);
      console.log(`  │ Camera: ${clip.cameraDirective}`);
      console.log(`  │ Style:  ${clip.styleModifiers.slice(0, 3).join(", ")}`);
      console.log(`  │`);
      console.log(`  │ PROMPT:`);
      // Word wrap at 68 chars
      const words = clip.wan25Prompt.split(" ");
      let line = "  │   ";
      for (const word of words) {
        if (line.length + word.length > 74) {
          console.log(line);
          line = "  │   ";
        }
        line += word + " ";
      }
      if (line.trim() !== "│") console.log(line);
      console.log(`  │`);
      console.log(`  │ NEGATIVE: ${clip.negativePrompt.slice(0, 60)}...`);
      console.log(`  └${"─".repeat(68)}`);
    }
    console.log(`\n  Total: ${video.clips.length} clips, ${video.totalDuration}s`);
    totalClips += video.clips.length;
    totalDuration += video.totalDuration;

    // 5. Audio
    const audio = await audioAgent.expand(video, seed);
    section("🔊 Audio Bloom");
    console.log(`  Voice lines: ${audio.voiceLines.length}`);
    for (const v of audio.voiceLines.slice(0, 4)) {
      console.log(`    [Clip ${v.clipIndex}] ${v.character} (${v.emotion}, ${v.language}): "${v.text.slice(0, 50)}..."`);
    }
    if (audio.voiceLines.length > 4) console.log(`    ... +${audio.voiceLines.length - 4} more`);

    console.log(`  SFX cues: ${audio.sfxCues.length}`);
    for (const s of audio.sfxCues) {
      console.log(`    [Clip ${s.clipIndex}] ${s.sfxJapanese} → ${s.description} (vol: ${s.volume})`);
    }

    console.log(`  Ambience: ${audio.ambience.length}`);
    for (const a of audio.ambience) {
      console.log(`    [Clip ${a.clipIndex}] ${a.description}`);
    }
  }

  // Summary
  header("📊 SUMMARY");
  console.log(`
  Pages bloomed:    ${showcasePages.length}
  Total clips:      ${totalClips}
  Total duration:   ${totalDuration}s (~${(totalDuration / 60).toFixed(1)} min)
  Backend:          local (deterministic)
  WAN 2.5 ready:    ✓

  To run with WebLLM (browser-side AI):
    import { AgentRunner } from "./webllm/agent-runner"
    const runner = new AgentRunner()
    await runner.runNarrative(seed)

  Recommended WebLLM models:
    Narrative: Qwen 2.5 3B   (structured JSON output)
    Visual:    Qwen 2.5 3B   (descriptive prompts)
    Video:     Phi 3.5 Mini   (fast format conversion)
    Audio:     Gemma 2 2B     (lightweight SFX mapping)
`);
}

main().catch(console.error);
