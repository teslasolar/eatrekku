"use client";

import { MangaPage as MangaPageType } from "@/types/manga";
import MangaPanel from "./MangaPanel";
import { PAGE_WIDTH, PAGE_HEIGHT, GUTTER_SIZE } from "@/lib/templates";

interface MangaPageProps {
  page: MangaPageType;
  maxWidth?: number;
}

export default function MangaPageView({ page, maxWidth = 500 }: MangaPageProps) {
  const scale = maxWidth / PAGE_WIDTH;
  const displayHeight = PAGE_HEIGHT * scale;

  const eraPalette = page.style.palette;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Page title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: eraPalette[3] || "#e94560" }}>
          {page.title}
        </h2>
        <p className="text-sm text-gray-400">
          {page.era} · {page.year}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {page.readingDirection === "rtl" ? "→ Read right to left" : "← Read left to right"}
        </p>
      </div>

      {/* Manga page */}
      <div
        className="manga-page page-shadow relative"
        style={{
          width: maxWidth,
          height: displayHeight,
          padding: GUTTER_SIZE * scale,
        }}
      >
        {page.panels.map((panel, index) => {
          const layout = page.template.layout[index];
          if (!layout) return null;
          return (
            <MangaPanel key={index} panel={panel} layout={layout} scale={scale} />
          );
        })}
      </div>

      {/* Footnotes */}
      {page.footnotes.length > 0 && (
        <div className="footnote-bar rounded-lg max-w-lg">
          <div className="text-xs font-bold mb-2 text-yellow-400">📝 Historical Notes</div>
          {page.footnotes.map((fn, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <span className="text-yellow-500 font-mono text-[10px]">
                Panel {fn.panelIndex + 1}:{" "}
              </span>
              {fn.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
