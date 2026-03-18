"use client";

import { useState } from "react";
import MangaPageView from "@/components/MangaPage";
import EraSelector from "@/components/EraSelector";
import FreeformInput from "@/components/FreeformInput";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import { generateMangaScript, generateFromFreeform } from "@/lib/script-generator";
import type { MangaPage, ReadingDirection } from "@/types/manga";

type InputMode = "freeform" | "browse" | "showcase";

export default function Home() {
  const [page, setPage] = useState<MangaPage | null>(null);
  const [mode, setMode] = useState<InputMode>("showcase");
  const [direction, setDirection] = useState<ReadingDirection>("rtl");
  const [selectedEra, setSelectedEra] = useState<string>();
  const [selectedEvent, setSelectedEvent] = useState<string>();

  const handleBrowseSelect = (eraId: string, eventId: string) => {
    setSelectedEra(eraId);
    setSelectedEvent(eventId);
    const result = generateMangaScript({ eraId, eventId, readingDirection: direction });
    setPage(result);
  };

  const handleFreeform = (prompt: string) => {
    const result = generateFromFreeform({ prompt, readingDirection: direction });
    setPage(result);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-red-500">Ea</span>
              <span className="text-white">Trekku</span>
              <span className="text-gray-500 text-lg ml-2">えあとれっく</span>
            </h1>
            <p className="text-xs text-gray-500">History in panels · 歴史をコマに</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 flex items-center gap-2">
              Reading:
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as ReadingDirection)}
                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-xs"
              >
                <option value="rtl">→ Right to Left (Manga)</option>
                <option value="ltr">← Left to Right (Webtoon)</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        {!page && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">
              Every historical moment is a{" "}
              <span className="text-red-500">manga page</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Pick a moment in history. Watch it become a manga page with panels, speech
              bubbles, sound effects, and dramatic angles. The drama is the hook. The
              footnotes are the education.
            </p>
          </div>
        )}

        {/* Input tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("freeform")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "freeform"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            ✍️ Describe a moment
          </button>
          <button
            onClick={() => setMode("showcase")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "showcase"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            🎴 Showcase
          </button>
          <button
            onClick={() => setMode("browse")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "browse"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            📖 Browse eras
          </button>
        </div>

        {/* Input area */}
        <div className="mb-8">
          {mode === "freeform" && <FreeformInput onSubmit={handleFreeform} />}
          {mode === "browse" && (
            <EraSelector
              onSelect={handleBrowseSelect}
              selectedEra={selectedEra}
              selectedEvent={selectedEvent}
            />
          )}
          {mode === "showcase" && <ShowcaseGallery />}
        </div>

        {/* Generated page */}
        {page && mode !== "showcase" && (
          <div className="flex flex-col items-center">
            <MangaPageView page={page} maxWidth={Math.min(500, typeof window !== "undefined" ? window.innerWidth - 32 : 500)} />

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  if (page) {
                    const result = generateMangaScript({
                      eraId: eraPacks.find((e) => e.name === page.era)?.id || "edo-japan",
                      eventId: page.event,
                      readingDirection: direction,
                    });
                    setPage(result);
                  }
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                🔄 Regenerate
              </button>
              <button
                onClick={() => setPage(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                ✨ New page
              </button>
            </div>

            {/* Style info */}
            <div className="mt-6 max-w-lg text-center">
              <div className="text-xs text-gray-500 mb-2">
                Style: {page.style.name} · Template: {page.template.name}
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                {page.style.palette.map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-gray-700"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {page.style.motifs.join(" · ")}
              </div>
            </div>
          </div>
        )}

        {/* Feature showcase when no page */}
        {!page && mode !== "showcase" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="font-bold mb-2">Manga Grammar</h3>
              <p className="text-sm text-gray-400">
                Real manga visual language — panel types, speech bubbles, emotion markers
                (漫符), sound effects (オノマトペ), speed lines, and dramatic composition.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl mb-3">🏯</div>
              <h3 className="font-bold mb-2">Era Packs</h3>
              <p className="text-sm text-gray-400">
                Each era has its own visual style — Edo Japan with ukiyo-e textures, Ancient
                Rome with mosaic patterns. Period-accurate details in every panel.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-bold mb-2">Real Education</h3>
              <p className="text-sm text-gray-400">
                Every page includes historical footnotes. The drama hooks you in. The
                footnotes teach you the facts. Like Golden Kamuy teaching Ainu culture.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-xs text-gray-600">
        <p>
          EaTrekku えあとれっく · An AirTrek AI Sub-Product ·{" "}
          <span className="text-gray-500">すべての瞬間が漫画</span>
        </p>
      </footer>
    </main>
  );
}

// Need eraPacks import for regenerate button
import { eraPacks } from "@/data/era-packs";
