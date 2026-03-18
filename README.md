# EaTrekku えあとれっく

**Every historical moment is a manga page.**

AI-powered manga panel generator that turns history into dramatic visual storytelling. An AirTrek AI sub-product.

## What It Does

Pick a historical moment → get a manga page with panels, speech bubbles, sound effects (オノマトペ), emotion markers (漫符), and dramatic composition. Educational footnotes teach real history alongside the drama.

## Era Packs

- 🏯 **Edo Japan** (1603–1868) — Sekigahara, 47 Ronin, Musashi's duel, Perry's Black Ships
- 🏛️ **Ancient Rome** (753 BC–476 AD) — Ides of March, Crossing the Rubicon, Pompeii, Fall of Rome

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS 4
- Manga script generator (text → structured panel data)
- Page layout engine with 4 templates (Buildup, Action, Revelation, Splash)
- Speech bubble system (7 types), SFX library (20+ effects), emotion markers (10 types)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
  app/          — Next.js app router (page, layout)
  components/   — MangaPage, MangaPanel, EraSelector, FreeformInput
  lib/          — script-generator, templates (layout engine)
  data/         — era-packs, sfx library
  types/        — TypeScript types for manga domain
```

すべての瞬間が漫画 — Every moment is a manga.
