"use client";

import { useState } from "react";
import { showcasePages } from "@/data/showcase-pages";
import MangaPageView from "./MangaPage";
import type { MangaPage } from "@/types/manga";

export default function ShowcaseGallery() {
  const [activePage, setActivePage] = useState<MangaPage | null>(null);

  if (activePage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage(null)}
            className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            &larr; Back to gallery
          </button>
          <div className="flex gap-2">
            {showcasePages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActivePage(p)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                  activePage.id === p.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <MangaPageView page={activePage} maxWidth={520} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-1">
          Showcase Gallery
        </h3>
        <p className="text-sm text-gray-400">
          Pre-generated manga pages — click to view full page
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showcasePages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => setActivePage(page)}
            className="group text-left bg-gray-800/60 border border-gray-700 rounded-xl p-4 hover:border-red-500/50 hover:bg-gray-800 transition-all"
          >
            {/* Mini preview */}
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-16 h-22 bg-[#f5f0e8] rounded overflow-hidden border border-gray-600 relative">
                {/* Mini panel grid */}
                <div className="absolute inset-1 flex flex-col gap-[2px]">
                  {page.panels.slice(0, 4).map((_, pi) => (
                    <div
                      key={pi}
                      className="flex-1 bg-white/80 border border-gray-300 rounded-[1px]"
                    />
                  ))}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[7px] text-white text-center py-0.5">
                  {page.panels.length} panels
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                  <h4 className="font-bold text-white group-hover:text-red-400 transition-colors truncate">
                    {page.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {page.era} · {page.year} · {page.template.name}
                </p>

                {/* First dialogue preview */}
                {page.panels[0]?.dialogue[0] && (
                  <div className="text-xs text-gray-300 italic line-clamp-2">
                    <span className="text-gray-500 not-italic">
                      {page.panels[0].dialogue[0].character}:{" "}
                    </span>
                    &ldquo;{page.panels[0].dialogue[0].text.slice(0, 80)}
                    {page.panels[0].dialogue[0].text.length > 80 ? "..." : ""}&rdquo;
                  </div>
                )}

                {/* Characters */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.from(new Set(page.panels.flatMap((p) => p.characters)))
                    .slice(0, 3)
                    .map((char) => (
                      <span
                        key={char}
                        className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded"
                      >
                        {char}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
