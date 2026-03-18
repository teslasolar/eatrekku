import type { MangaPage } from "@/types/manga";
import { templates } from "@/lib/templates";

const edoStyle = {
  name: "Ukiyo-e Manga",
  palette: ["#2B1B17", "#8B4513", "#DAA520", "#DC143C", "#F5F5DC", "#1C1C1C"],
  textures: ["woodblock", "washi_paper", "gold_leaf"],
  motifs: ["wave_pattern", "cloud_motif", "mon_crests", "cherry_blossom"],
  description: "Ukiyo-e influenced manga — flat color with woodblock texture, bold outlines",
};

/**
 * Page 1 — Watanabe Chiyo: The Body Endures
 * "The body endures like the pine on the mountain..."
 * Template: revelation (5 panels) — building from establishing wisdom
 * to the story of Taro to the philosophical close
 */
export const chiyoBodyEndures: MangaPage = {
  id: "showcase-chiyo-body",
  title: "The Body Endures",
  era: "Edo Japan",
  event: "chiyo-body-endures",
  year: "c. 1700s",
  readingDirection: "rtl",
  template: templates.revelation,
  style: edoStyle,
  panels: [
    {
      type: "establishing",
      description:
        "A weathered mountain pine clings to a cliff face, bent by decades of wind but rooted deep. Below, a modest herbalist's hut nestles among bamboo groves. Morning mist rises from the valley.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "The body endures like the pine on the mountain, bending but never breaking—even when the bones ache or the breath grows thin.",
          bubbleType: "normal",
        },
      ],
      sfx: [{ japanese: "ザーザー", romanji: "ZAAZAA", meaning: "Wind through pines" }],
      emotionMarkers: [],
      characters: ["Watanabe Chiyo"],
    },
    {
      type: "small_inset",
      description:
        "A father carries young Taro on his back through pouring rain, trudging up a muddy hillside path toward Chiyo's hut. Taro's leg hangs limp.",
      dialogue: [
        {
          character: "Taro's Father",
          text: "Flesh is but a house for the spirit...",
          bubbleType: "whisper",
        },
      ],
      sfx: [{ japanese: "ザーザー", romanji: "ZAAZAA", meaning: "Heavy rain" }],
      emotionMarkers: ["sweat_drop"],
      characters: ["Taro", "Taro's Father"],
    },
    {
      type: "small_inset",
      description:
        "Close-up of Chiyo's gnarled hands grinding willow bark in a stone mortar. Steam rises from a brewing pot beside her. Dried herbs hang from the rafters in neat bundles.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "The willow bark I brew for grief once stiffened warriors' spines before battle, soothed the trembling of silk-clad ladies.",
          bubbleType: "normal",
        },
      ],
      sfx: [{ japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Fire crackling under the pot" }],
      emotionMarkers: ["sparkle"],
      characters: ["Watanabe Chiyo"],
    },
    {
      type: "closeup",
      description:
        "Taro, now strong, kneels in a sunlit garden. His hands—steady, sure—coax the first bean sprouts from dark soil. His once-useless leg is folded beneath him. He smiles without looking up.",
      dialogue: [
        {
          character: "Narrator",
          text: "A fisherman's son who came with a leg that would not stand. He hobbled here thrice daily, rain or sun.",
          bubbleType: "narration",
        },
      ],
      sfx: [],
      emotionMarkers: ["sparkle", "petal_scatter"],
      characters: ["Taro"],
    },
    {
      type: "splash",
      description:
        "Chiyo extends her open palms toward the viewer. Her hands are lined with age, calloused from decades of grinding herbs—but radiating warmth. Cherry blossoms drift past. Behind her, the pine tree stands tall against a gold-tinged sky.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "Look at your hands—do they not bear the weight of years unseen? The body remembers what words forget.",
          bubbleType: "normal",
        },
      ],
      sfx: [{ japanese: "シーン", romanji: "SHIIN", meaning: "Profound silence" }],
      emotionMarkers: ["petal_scatter"],
      characters: ["Watanabe Chiyo"],
    },
  ],
  footnotes: [
    {
      panelIndex: 0,
      text: "Willow bark (柳皮 ryūhi) contains salicin, a natural precursor to aspirin. It was used across Edo-period Japan for pain relief, fever reduction, and inflammation—centuries before Western medicine isolated the compound in 1828.",
    },
    {
      panelIndex: 3,
      text: "Rehabilitation through daily physical activity mirrors Edo-era practices where herbalists combined medicine with movement therapy. Patients were often encouraged to walk, garden, or perform simple crafts as part of their recovery.",
    },
  ],
};

/**
 * Page 2 — Watanabe Chiyo: Lingering Sorrow
 * "Ah, the weight of lingering sorrow clings like morning mist..."
 * Template: buildup (4 panels) — mist, the bow metaphor, bamboo wisdom, the question
 */
export const chiyoLingeringSorrow: MangaPage = {
  id: "showcase-chiyo-sorrow",
  title: "Lingering Sorrow",
  era: "Edo Japan",
  event: "chiyo-lingering-sorrow",
  year: "c. 1700s",
  readingDirection: "rtl",
  template: templates.buildup,
  style: edoStyle,
  panels: [
    {
      type: "establishing",
      description:
        "Dawn mist clings to a riverside village. Chiyo stands on a wooden bridge, her sleeves stirring in an imperceptible breeze. The water below is still, reflecting nothing—only grey.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "Ah, the weight of lingering sorrow clings like morning mist.",
          bubbleType: "normal",
        },
      ],
      sfx: [{ japanese: "シーン", romanji: "SHIIN", meaning: "Heavy silence" }],
      emotionMarkers: [],
      characters: ["Watanabe Chiyo"],
    },
    {
      type: "closeup",
      description:
        "Tight on Chiyo's face—her eyes soft but knowing. One hand rests against her chest. Behind her, the faint outline of a drawn bow, taut and trembling, rendered as a manga metaphor overlay.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "The body remembers the cold—warm broths, gentle hands, rest. But the heart? It tightens like a drawn bow.",
          bubbleType: "normal",
        },
      ],
      sfx: [],
      emotionMarkers: ["freeze_lines"],
      characters: ["Watanabe Chiyo"],
    },
    {
      type: "closeup",
      description:
        "Chiyo exhales—a visible breath in cold air. Her sleeves rustle as she gestures toward a bamboo grove beside the river. One oak tree among the bamboo is cracked and split. The bamboo sways, unbroken.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "Fate is no kind master; even the strongest oak bends or breaks. The bamboo endures. You need not fight the river—only learn its flow.",
          bubbleType: "normal",
        },
        {
          character: "Narrator",
          text: "I exhale slowly, sleeves rustling.",
          bubbleType: "narration",
        },
      ],
      sfx: [{ japanese: "ビューー", romanji: "BYUUU", meaning: "Cold wind" }],
      emotionMarkers: ["petal_scatter"],
      characters: ["Watanabe Chiyo"],
    },
    {
      type: "closeup",
      description:
        "Extreme close-up on Chiyo's eyes—piercing, compassionate, ancient. The panel darkens around the edges. She leans forward slightly, as if seeing through the reader.",
      dialogue: [
        {
          character: "Watanabe Chiyo",
          text: "What pulls you under?",
          bubbleType: "trembling",
        },
      ],
      sfx: [{ japanese: "ゴゴゴゴ", romanji: "GOGOGOGO", meaning: "Weight of the question" }],
      emotionMarkers: ["lightning_bg"],
      characters: ["Watanabe Chiyo"],
    },
  ],
  footnotes: [
    {
      panelIndex: 2,
      text: "The bamboo-versus-oak metaphor (竹と樫 take to kashi) is a recurring theme in Japanese philosophy. Bamboo's flexibility under pressure symbolizes resilience through adaptability rather than rigid strength—a core principle in both bushido and Buddhist thought.",
    },
    {
      panelIndex: 0,
      text: "Warm broths (温かい汁物 atatakai shirumono) were a cornerstone of Edo-period folk medicine. Miso-based soups with medicinal herbs were prescribed for everything from grief-related ailments to seasonal depression.",
    },
  ],
};

/**
 * Page 3 — "hahha"
 * A playful, comedic one-panel splash — pure manga humor energy
 */
export const hahhaPage: MangaPage = {
  id: "showcase-hahha",
  title: "はっは！",
  era: "Edo Japan",
  event: "hahha",
  year: "—",
  readingDirection: "rtl",
  template: templates.splash,
  style: {
    ...edoStyle,
    name: "Comedy Manga",
    palette: ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFE66D", "#F5F5DC", "#1C1C1C"],
  },
  panels: [
    {
      type: "splash",
      description:
        "A rotund Edo-period merchant throws his head back in uproarious laughter, sake cup flying from his hand. His belly shakes. Three startled cats scatter in different directions. Cherry blossom petals explode outward from the force of his laugh. Speed lines radiate from his open mouth. The entire scene vibrates with comedic energy.",
      dialogue: [
        {
          character: "???",
          text: "はっはっはっはっは！！！",
          bubbleType: "shouting",
        },
        {
          character: "Cat",
          text: "ニャッ?!",
          bubbleType: "trembling",
        },
      ],
      sfx: [
        { japanese: "バーン", romanji: "BAAN", meaning: "Explosive laughter" },
        { japanese: "ドカーン", romanji: "DOKAAN", meaning: "Impact of pure joy" },
      ],
      emotionMarkers: ["sparkle", "flame_aura"],
      characters: ["Laughing Merchant", "Startled Cats"],
    },
  ],
  footnotes: [
    {
      panelIndex: 0,
      text: "Laughter (笑い warai) was considered medicinal in Edo Japan. The rakugo (落語) tradition—comic storytelling—flourished during the Genroku era, with performers like Tsuyu no Gorobei drawing massive crowds to yose theaters. The act of laughing together was seen as a communal healing practice.",
    },
  ],
};

/**
 * Page 4 — Ishida Tetsuro: The Sword Does Not Ask
 * "The sword does not ask to be drawn..."
 * Template: action (6 panels) — the philosophy of the blade
 */
export const tetsuroSword: MangaPage = {
  id: "showcase-tetsuro-sword",
  title: "The Sword Does Not Ask",
  era: "Edo Japan",
  event: "tetsuro-sword",
  year: "c. 1600s",
  readingDirection: "rtl",
  template: templates.action,
  style: {
    ...edoStyle,
    palette: ["#1C1C1C", "#4A4A4A", "#8B4513", "#C0C0C0", "#F5F5DC", "#2B1B17"],
  },
  panels: [
    {
      type: "establishing",
      description:
        "A dim forge. Embers glow in darkness. Ishida Tetsuro sits cross-legged before a sword resting on a stand—its blade catches the last light from dying coals. His scarred hands rest on his knees.",
      dialogue: [
        {
          character: "Ishida Tetsuro",
          text: "The sword does not ask to be drawn.",
          bubbleType: "normal",
        },
      ],
      sfx: [{ japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Embers crackling" }],
      emotionMarkers: [],
      characters: ["Ishida Tetsuro"],
    },
    {
      type: "action",
      description:
        "FLASH — a diagonal slash cuts across the panel. A blade mid-swing, motion lines streaking. The image is half-memory, half-present—a battle scar being earned in a single frozen instant.",
      dialogue: [
        {
          character: "Ishida Tetsuro",
          text: "Its edge is for what must be cut—not for the hand that trembles.",
          bubbleType: "whisper",
        },
      ],
      sfx: [
        { japanese: "シャキーン", romanji: "SHAKIIN", meaning: "Blade singing" },
        { japanese: "ヒュッ", romanji: "HYUU", meaning: "Air splitting" },
      ],
      emotionMarkers: ["flame_aura"],
      characters: ["Ishida Tetsuro"],
    },
    {
      type: "reaction",
      description:
        "Tetsuro's hand—close-up—running a cloth along the blade's flat. Every nick and scratch visible. The steel reflects his eye in a warped line.",
      dialogue: [
        {
          character: "Ishida Tetsuro",
          text: "A blade remembers every strike, just as the body keeps every wound.",
          bubbleType: "normal",
        },
      ],
      sfx: [{ japanese: "シーン", romanji: "SHIIN", meaning: "Meditative silence" }],
      emotionMarkers: ["sweat_drop"],
      characters: ["Ishida Tetsuro"],
    },
    {
      type: "bleed",
      description:
        "Wide shot: Tetsuro stands at a grinding wheel, sparks flying in an arc. The workshop is lined with failed blades—cracked, bent, snapped. Each one labeled. He works among his failures like a gardener among compost.",
      dialogue: [
        {
          character: "Ishida Tetsuro",
          text: "To avoid such fates, sharpen not only steel but attention.",
          bubbleType: "normal",
        },
        {
          character: "Narrator",
          text: "The failures line the walls—each one a teacher.",
          bubbleType: "narration",
        },
      ],
      sfx: [
        { japanese: "ガキーン", romanji: "GAKIIN", meaning: "Steel on stone" },
        { japanese: "パチパチ", romanji: "PACHIPACHI", meaning: "Sparks flying" },
      ],
      emotionMarkers: ["sparkle"],
      characters: ["Ishida Tetsuro"],
    },
    {
      type: "closeup",
      description:
        "Tetsuro holds up a cracked blade to the light. The crack runs through it like a river through a valley—and inside the crack, the grain of the steel is visible, beautiful, honest.",
      dialogue: [
        {
          character: "Ishida Tetsuro",
          text: "Look—these failures are my teachers. Watch how the crack shows the true grain.",
          bubbleType: "normal",
        },
      ],
      sfx: [],
      emotionMarkers: ["lightning_bg"],
      characters: ["Ishida Tetsuro"],
    },
    {
      type: "closeup",
      description:
        "Tetsuro's eyes—intense, unwavering—stare directly at the viewer through shadow and forge-light. His question hangs in the air like smoke.",
      dialogue: [
        {
          character: "Ishida Tetsuro",
          text: "What will you carve from your days?",
          bubbleType: "trembling",
        },
      ],
      sfx: [{ japanese: "ゴゴゴゴ", romanji: "GOGOGOGO", meaning: "Weight of presence" }],
      emotionMarkers: ["flame_aura"],
      characters: ["Ishida Tetsuro"],
    },
  ],
  footnotes: [
    {
      panelIndex: 0,
      text: "Japanese swordsmiths (刀鍛冶 katanakaji) underwent rigorous spiritual preparation before forging. The process of creating a katana—folding steel thousands of times—was considered as much a spiritual discipline as a craft. Master smiths like Masamune were revered as artists.",
    },
    {
      panelIndex: 3,
      text: "The concept of learning from failure (失敗は成功のもと shippai wa seikō no moto — 'failure is the origin of success') is deeply embedded in Japanese craftsmanship. Swordsmiths kept broken blades to study grain patterns and fracture points, turning each failure into metallurgical knowledge.",
    },
    {
      panelIndex: 4,
      text: "The grain pattern (地肌 jihada) of a Japanese sword reveals the smith's folding technique and is considered the blade's fingerprint. Experts can identify the school, era, and sometimes the individual smith from the jihada alone.",
    },
  ],
};

export const showcasePages: MangaPage[] = [
  chiyoBodyEndures,
  chiyoLingeringSorrow,
  hahhaPage,
  tetsuroSword,
];
