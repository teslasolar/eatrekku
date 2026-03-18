import { PageTemplate, PanelLayout } from "@/types/manga";

const GUTTER = 8;
const PAGE_W = 1000;
const PAGE_H = 1414; // ~manga aspect ratio

function px(pct: number, total: number) {
  return Math.round((pct / 100) * total);
}

export const templates: Record<string, PageTemplate> = {
  buildup: {
    name: "The Buildup",
    description: "4 panels — wide establishing shot, two medium panels, emotional close-up",
    panelCount: 4,
    layout: [
      { x: 0, y: 0, width: PAGE_W, height: px(28, PAGE_H) },
      { x: 0, y: px(28, PAGE_H) + GUTTER, width: px(48, PAGE_W), height: px(30, PAGE_H) },
      { x: px(48, PAGE_W) + GUTTER, y: px(28, PAGE_H) + GUTTER, width: px(52, PAGE_W) - GUTTER, height: px(30, PAGE_H) },
      { x: 0, y: px(58, PAGE_H) + GUTTER * 2, width: PAGE_W, height: px(42, PAGE_H) - GUTTER * 2 },
    ],
  },
  action: {
    name: "The Action",
    description: "6 panels — setup, diagonal action, wide impact, two reactions",
    panelCount: 6,
    layout: [
      { x: 0, y: 0, width: px(35, PAGE_W), height: px(22, PAGE_H) },
      {
        x: px(35, PAGE_W) + GUTTER,
        y: 0,
        width: px(65, PAGE_W) - GUTTER,
        height: px(35, PAGE_H),
        clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
      },
      { x: 0, y: px(22, PAGE_H) + GUTTER, width: px(35, PAGE_W), height: px(13, PAGE_H) },
      { x: 0, y: px(35, PAGE_H) + GUTTER * 2, width: PAGE_W, height: px(28, PAGE_H) },
      { x: 0, y: px(63, PAGE_H) + GUTTER * 3, width: px(45, PAGE_W), height: px(37, PAGE_H) - GUTTER * 3 },
      { x: px(45, PAGE_W) + GUTTER, y: px(63, PAGE_H) + GUTTER * 3, width: px(55, PAGE_W) - GUTTER, height: px(37, PAGE_H) - GUTTER * 3 },
    ],
  },
  revelation: {
    name: "The Revelation",
    description: "5 panels — dialogue, building details, close-up realization, splash reveal",
    panelCount: 5,
    layout: [
      { x: 0, y: 0, width: PAGE_W, height: px(22, PAGE_H) },
      { x: 0, y: px(22, PAGE_H) + GUTTER, width: px(30, PAGE_W), height: px(28, PAGE_H) },
      { x: px(30, PAGE_W) + GUTTER, y: px(22, PAGE_H) + GUTTER, width: px(30, PAGE_W) - GUTTER, height: px(28, PAGE_H) },
      { x: px(60, PAGE_W) + GUTTER, y: px(22, PAGE_H) + GUTTER, width: px(40, PAGE_W) - GUTTER, height: px(28, PAGE_H) },
      { x: 0, y: px(50, PAGE_H) + GUTTER * 2, width: PAGE_W, height: px(50, PAGE_H) - GUTTER * 2 },
    ],
  },
  splash: {
    name: "The Splash",
    description: "1 panel — full page, maximum drama",
    panelCount: 1,
    layout: [{ x: 0, y: 0, width: PAGE_W, height: PAGE_H }],
  },
};

export function getTemplate(name: string): PageTemplate {
  return templates[name] || templates.buildup;
}

export function getLayoutForPanel(template: PageTemplate, index: number): PanelLayout {
  return template.layout[index % template.layout.length];
}

export const PAGE_WIDTH = PAGE_W;
export const PAGE_HEIGHT = PAGE_H;
export const GUTTER_SIZE = GUTTER;
