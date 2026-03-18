import { PageTemplate, PanelLayout } from "@/types/manga";

// All coordinates are percentages (0-100) of the page
const GUTTER = 1.5; // percentage gap between panels

export const templates: Record<string, PageTemplate> = {
  buildup: {
    name: "The Buildup",
    description: "4 panels — wide establishing shot, two medium panels, close-up face",
    panelCount: 4,
    layout: [
      { x: 0, y: 0, width: 100, height: 30 },
      { x: 0, y: 30 + GUTTER, width: 49, height: 30 },
      { x: 51, y: 30 + GUTTER, width: 49, height: 30 },
      { x: 0, y: 62 + GUTTER, width: 100, height: 36.5 },
    ],
  },
  action: {
    name: "The Action",
    description: "6 panels — setup, diagonal action, wide impact, two reactions",
    panelCount: 6,
    layout: [
      { x: 0, y: 0, width: 30, height: 22 },
      { x: 32, y: 0, width: 68, height: 22, clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" },
      { x: 0, y: 23.5, width: 30, height: 22 },
      { x: 32, y: 23.5, width: 68, height: 22, clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)" },
      { x: 0, y: 47, width: 100, height: 25 },
      { x: 0, y: 73.5, width: 49, height: 25 },
    ],
  },
  revelation: {
    name: "The Revelation",
    description: "5 panels — dialogue, building details, close-up, splash reveal",
    panelCount: 5,
    layout: [
      { x: 0, y: 0, width: 100, height: 22 },
      { x: 0, y: 23.5, width: 30, height: 25 },
      { x: 32, y: 23.5, width: 30, height: 25 },
      { x: 64, y: 23.5, width: 36, height: 52 },
      { x: 0, y: 50, width: 62, height: 25.5 },
    ],
  },
  splash: {
    name: "The Splash",
    description: "1 panel — full page, maximum drama",
    panelCount: 1,
    layout: [{ x: 0, y: 0, width: 100, height: 100 }],
  },
};

// Add a reaction row to the action template
templates.action.layout.push({ x: 51, y: 73.5, width: 49, height: 25 });

export function getTemplate(name: string): PageTemplate {
  return templates[name] || templates.buildup;
}

export function getLayoutForPanels(panelCount: number): PageTemplate {
  if (panelCount <= 1) return templates.splash;
  if (panelCount <= 4) return templates.buildup;
  if (panelCount <= 5) return templates.revelation;
  return templates.action;
}

export function panelLayoutToCSS(layout: PanelLayout): React.CSSProperties {
  return {
    position: "absolute",
    left: `${layout.x}%`,
    top: `${layout.y}%`,
    width: `${layout.width}%`,
    height: `${layout.height}%`,
    clipPath: layout.clipPath,
  };
}
