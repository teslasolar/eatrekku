export type PanelType =
  | "establishing"
  | "closeup"
  | "action"
  | "reaction"
  | "splash"
  | "bleed"
  | "tall_narrow"
  | "small_inset"
  | "split"
  | "black";

export type BubbleType =
  | "normal"
  | "shouting"
  | "thinking"
  | "whisper"
  | "narration"
  | "sfx"
  | "electronic"
  | "trembling";

export type EmotionMarker =
  | "anger_vein"
  | "sweat_drop"
  | "sparkle"
  | "spiral_eyes"
  | "flame_aura"
  | "freeze_lines"
  | "blush_lines"
  | "lightning_bg"
  | "petal_scatter"
  | "ghost_escape";

export type ReadingDirection = "rtl" | "ltr";

export type OutputFormat = "single_page" | "social_share" | "story_format" | "print_ready";

export interface Dialogue {
  character: string;
  text: string;
  bubbleType: BubbleType;
  translation?: string;
}

export interface SoundEffect {
  japanese: string;
  romanji: string;
  meaning: string;
}

export interface Panel {
  type: PanelType;
  description: string;
  dialogue: Dialogue[];
  sfx: SoundEffect[];
  emotionMarkers: EmotionMarker[];
  characters: string[];
  footnote?: string;
}

export interface MangaPage {
  id: string;
  title: string;
  era: string;
  event: string;
  year: string;
  panels: Panel[];
  template: PageTemplate;
  readingDirection: ReadingDirection;
  footnotes: Footnote[];
  style: EraStyle;
}

export interface Footnote {
  panelIndex: number;
  text: string;
}

export interface PageTemplate {
  name: string;
  description: string;
  panelCount: number;
  layout: PanelLayout[];
}

export interface PanelLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  clipPath?: string;
}

export interface EraStyle {
  name: string;
  palette: string[];
  textures: string[];
  motifs: string[];
  description: string;
}

export interface EraPack {
  id: string;
  name: string;
  nameJp: string;
  period: string;
  events: HistoricalEvent[];
  characters: string[];
  style: EraStyle;
  icon: string;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  year: string;
  description: string;
  characters: string[];
  dramaticPeak: string;
  suggestedTemplate: string;
}
